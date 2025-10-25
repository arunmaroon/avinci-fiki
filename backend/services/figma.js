const axios = require('axios');
const crypto = require('crypto');
const redis = require('redis');

// Redis client for OAuth token storage
let redisClient = null;

// Initialize Redis connection
const initRedis = async () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    console.warn('Redis connection refused, OAuth tokens will not be persisted');
                    return new Error('Redis connection refused');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    return undefined;
                }
                return Math.min(options.attempt * 100, 3000);
            }
        });

        redisClient.on('error', (err) => {
            console.warn('Redis Client Error:', err);
        });

        try {
            await redisClient.connect();
            console.log('✅ Redis connected for Figma OAuth');
        } catch (error) {
            console.warn('⚠️ Redis connection failed, OAuth tokens will not be persisted:', error.message);
        }
    }
    return redisClient;
};

// Figma API configuration
const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_OAUTH_BASE = 'https://www.figma.com/oauth';

/**
 * Generate OAuth URL for Figma authentication
 * @param {string} state - Random state string for security
 * @returns {string} OAuth URL
 */
const getOAuthUrl = (state) => {
    const clientId = process.env.FIGMA_CLIENT_ID;
    const redirectUri = process.env.FIGMA_REDIRECT_URI || 'http://localhost:3000/admin/figma-callback';
    
    if (!clientId) {
        throw new Error('FIGMA_CLIENT_ID environment variable is required');
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'file_read',
        state: state,
        response_type: 'code'
    });

    return `${FIGMA_OAUTH_BASE}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from Figma
 * @returns {Promise<Object>} Token response
 */
const exchangeCodeForToken = async (code) => {
    const clientId = process.env.FIGMA_CLIENT_ID;
    const clientSecret = process.env.FIGMA_CLIENT_SECRET;
    const redirectUri = process.env.FIGMA_REDIRECT_URI || 'http://localhost:3000/admin/figma-callback';

    if (!clientId || !clientSecret) {
        throw new Error('FIGMA_CLIENT_ID and FIGMA_CLIENT_SECRET environment variables are required');
    }

    try {
        const response = await axios.post('https://www.figma.com/oauth/token', 
            `client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}&grant_type=authorization_code`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return {
            access_token: response.data.access_token,
            token_type: response.data.token_type || 'Bearer',
            expires_in: response.data.expires_in || 3600,
            refresh_token: response.data.refresh_token
        };
    } catch (error) {
        console.error('Error exchanging code for token:', error.response?.data || error.message);
        throw new Error(`Failed to exchange code for token: ${error.response?.data?.error_description || error.message}`);
    }
};

/**
 * Store OAuth token in Redis
 * @param {string} state - State string
 * @param {Object} token - Token object
 * @param {number} expiresIn - Token expiration in seconds
 */
const storeTokenForState = async (state, token, expiresIn = 3600) => {
    try {
        const client = await initRedis();
        if (client) {
            const key = `figma_oauth:${state}`;
            const value = JSON.stringify({
                ...token,
                created_at: new Date().toISOString()
            });
            
            await client.setEx(key, expiresIn, value);
            console.log(`✅ OAuth token stored for state: ${state}`);
        }
    } catch (error) {
        console.warn('Failed to store OAuth token:', error.message);
    }
};

/**
 * Retrieve OAuth token from Redis
 * @param {string} state - State string
 * @returns {Promise<Object|null>} Token object or null
 */
const getTokenForState = async (state) => {
    try {
        const client = await initRedis();
        if (client) {
            const key = `figma_oauth:${state}`;
            const value = await client.get(key);
            
            if (value) {
                const token = JSON.parse(value);
                console.log(`✅ OAuth token retrieved for state: ${state}`);
                return token;
            }
        }
    } catch (error) {
        console.warn('Failed to retrieve OAuth token:', error.message);
    }
    return null;
};

/**
 * Fetch Figma file data
 * @param {string} fileKey - Figma file key
 * @param {string} accessToken - Figma access token
 * @returns {Promise<Object>} Figma file data
 */
const getFigmaFile = async (fileKey, accessToken) => {
    try {
        console.log(`🔍 Fetching Figma file: ${fileKey}`);
        
        const response = await axios.get(`${FIGMA_API_BASE}/files/${fileKey}`, {
            headers: {
                'X-Figma-Token': accessToken
            },
            params: {
                geometry: 'paths',
                plugin_data: 'shared'
            }
        });

        console.log(`✅ Figma file fetched successfully: ${fileKey}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Figma file:', error.response?.data || error.message);
        
        if (error.response?.status === 403) {
            throw new Error('Access denied. Please check if the file is public or you have permission to access it.');
        } else if (error.response?.status === 404) {
            throw new Error('File not found. Please check the file key.');
        } else if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(`Failed to fetch Figma file: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Fetch Figma file images
 * @param {string} fileKey - Figma file key
 * @param {string} accessToken - Figma access token
 * @param {Array} nodeIds - Array of node IDs to get images for
 * @returns {Promise<Object>} Images data
 */
const getFigmaImages = async (fileKey, accessToken, nodeIds = []) => {
    try {
        if (nodeIds.length === 0) {
            return { images: {} };
        }

        console.log(`🖼️ Fetching Figma images for ${nodeIds.length} nodes`);
        
        const response = await axios.get(`${FIGMA_API_BASE}/images/${fileKey}`, {
            headers: {
                'X-Figma-Token': accessToken
            },
            params: {
                ids: nodeIds.join(','),
                format: 'png',
                scale: 2
            }
        });

        console.log(`✅ Figma images fetched successfully`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Figma images:', error.response?.data || error.message);
        return { images: {} };
    }
};

/**
 * Generate random state string for OAuth
 * @returns {string} Random state string
 */
const generateState = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Validate Figma file key format
 * @param {string} fileKey - Figma file key
 * @returns {boolean} True if valid
 */
const validateFileKey = (fileKey) => {
    // Figma file keys are typically 22 characters long and contain alphanumeric characters
    const figmaKeyRegex = /^[a-zA-Z0-9]{22}$/;
    return figmaKeyRegex.test(fileKey);
};

/**
 * Extract file key from Figma URL
 * @param {string} url - Figma URL
 * @returns {string|null} File key or null
 */
const extractFileKeyFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        
        // Handle different Figma URL formats
        // https://www.figma.com/file/FILE_KEY/...
        // https://www.figma.com/design/FILE_KEY/...
        const match = urlObj.pathname.match(/\/(?:file|design)\/([a-zA-Z0-9]{22})/);
        
        if (match) {
            return match[1];
        }
        
        return null;
    } catch (error) {
        return null;
    }
};

/**
 * Test Figma API connectivity
 * @param {string} accessToken - Figma access token
 * @returns {Promise<boolean>} True if connected
 */
const testConnection = async (accessToken) => {
    try {
        const response = await axios.get(`${FIGMA_API_BASE}/me`, {
            headers: {
                'X-Figma-Token': accessToken
            }
        });
        
        console.log('✅ Figma API connection successful');
        return true;
    } catch (error) {
        console.error('❌ Figma API connection failed:', error.response?.data || error.message);
        return false;
    }
};

module.exports = {
    getOAuthUrl,
    exchangeCodeForToken,
    storeTokenForState,
    getTokenForState,
    getFigmaFile,
    getFigmaImages,
    generateState,
    validateFileKey,
    extractFileKeyFromUrl,
    testConnection,
    initRedis
};

