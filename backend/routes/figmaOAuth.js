const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../models/database');

// Figma OAuth configuration
const FIGMA_CLIENT_ID = process.env.FIGMA_CLIENT_ID || 'HUhnGuo9UYecpr89BZTvUF';
const FIGMA_CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET || '9Z8lq6PTRYU27gC4FABVajr3dZcoNE';
const FIGMA_REDIRECT_URI = process.env.FIGMA_REDIRECT_URI || 'http://localhost:3000/admin/figma-callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Initiate Figma OAuth flow
 */
router.get('/login', async (req, res) => {
  try {
    const state = uuidv4();
    const scope = 'file_content:read';
    
    const authUrl = `https://www.figma.com/oauth?client_id=${FIGMA_CLIENT_ID}&redirect_uri=${encodeURIComponent(FIGMA_REDIRECT_URI)}&scope=${scope}&state=${state}&response_type=code`;
    
    console.log('🔐 Initiating Figma OAuth flow...');
    console.log('📍 Auth URL:', authUrl);
    
    res.json({
      success: true,
      authUrl,
      state
    });
  } catch (error) {
    console.error('❌ OAuth initiation failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate OAuth flow',
      details: error.message
    });
  }
});

/**
 * Handle Figma OAuth callback
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    console.log('🔄 Figma OAuth callback received');
    console.log('📝 Code:', code ? 'Present' : 'Missing');
    console.log('📝 State:', state);
    console.log('📝 Error:', error);
    
    if (error) {
      console.error('❌ OAuth error:', error);
      return res.redirect(`${FRONTEND_URL}/admin/enhanced-converter?error=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      console.error('❌ No authorization code received');
      return res.redirect(`${FRONTEND_URL}/admin/enhanced-converter?error=no_code`);
    }
    
    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const tokenResponse = await axios.post('https://www.figma.com/oauth/token', {
      client_id: FIGMA_CLIENT_ID,
      client_secret: FIGMA_CLIENT_SECRET,
      redirect_uri: FIGMA_REDIRECT_URI,
      code: code,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('✅ Token exchange successful');
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Get user info
    console.log('👤 Fetching user info...');
    const userResponse = await axios.get('https://api.figma.com/v1/me', {
      headers: {
        'X-Figma-Token': access_token
      }
    });
    
    const userInfo = userResponse.data;
    console.log('✅ User info retrieved:', userInfo.handle);
    
    // Store tokens in database
    const userId = uuidv4(); // Generate anonymous user ID
    console.log('💾 Storing tokens for user:', userId);
    
    await db.query(
      'INSERT INTO figma_oauth_tokens (user_id, access_token, refresh_token, expires_in, user_info) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET access_token = $2, refresh_token = $3, expires_in = $4, user_info = $5, updated_at = CURRENT_TIMESTAMP',
      [userId, access_token, refresh_token, expires_in, JSON.stringify(userInfo)]
    );
    
    console.log('✅ Tokens stored successfully');
    
    // Redirect to frontend with success
    res.redirect(`${FRONTEND_URL}/admin/enhanced-converter?figma_auth=success&user=${encodeURIComponent(userInfo.handle)}`);
    
  } catch (error) {
    console.error('❌ OAuth callback failed:', error.message);
    console.error('📝 Error details:', error.response?.data);
    
    res.redirect(`${FRONTEND_URL}/admin/enhanced-converter?error=callback_failed&details=${encodeURIComponent(error.message)}`);
  }
});

/**
 * Get user's Figma files
 */
router.get('/files', async (req, res) => {
  try {
    console.log('📁 Fetching user files...');
    
    // Get the most recent token
    const result = await db.query(
      'SELECT access_token, user_info FROM figma_oauth_tokens ORDER BY updated_at DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'No authentication found',
        details: 'Please authenticate with Figma first'
      });
    }
    
    const { access_token, user_info } = result.rows[0];
    console.log('✅ Using token for user:', user_info?.handle);
    
    // Fetch recent files
    const response = await axios.get('https://api.figma.com/v1/files/recent', {
      headers: {
        'X-Figma-Token': access_token
      }
    });
    
    const files = response.data.files.map(file => ({
      key: file.key,
      name: file.name,
      thumbnail_url: file.thumbnail_url,
      last_modified: file.last_modified,
      url: `https://www.figma.com/file/${file.key}/${file.name}`
    }));
    
    console.log(`✅ Retrieved ${files.length} files`);
    
    res.json({
      success: true,
      files,
      user: user_info
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch files:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Figma files',
      details: error.message
    });
  }
});

/**
 * Get team files
 */
router.get('/team-files', async (req, res) => {
  try {
    console.log('👥 Fetching team files...');
    
    // Get the most recent token
    const result = await db.query(
      'SELECT access_token, user_info FROM figma_oauth_tokens ORDER BY updated_at DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'No authentication found',
        details: 'Please authenticate with Figma first'
      });
    }
    
    const { access_token } = result.rows[0];
    
    // Fetch team files
    const response = await axios.get('https://api.figma.com/v1/teams/me', {
      headers: {
        'X-Figma-Token': access_token
      }
    });
    
    const teams = response.data.teams;
    console.log(`✅ Found ${teams.length} teams`);
    
    res.json({
      success: true,
      teams
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch team files:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team files',
      details: error.message
    });
  }
});

/**
 * Get MoneyView design system
 */
router.get('/design-system', async (req, res) => {
  try {
    console.log('🎨 Fetching MoneyView design system...');
    
    const designSystemFileId = 'NjusHb5fdWfAdu04osdG6n';
    let accessToken = null;
    
    try {
      // Try to get OAuth token first
      const result = await db.query(
        'SELECT access_token FROM figma_oauth_tokens ORDER BY updated_at DESC LIMIT 1'
      );
      
      if (result.rows.length > 0) {
        accessToken = result.rows[0].access_token;
        console.log('✅ Using OAuth token for design system access');
      }
    } catch (dbError) {
      console.log('⚠️ No OAuth token found, using personal access token');
    }
    
    // Fallback to personal access token if OAuth token not available
    if (!accessToken) {
      accessToken = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || 'your_figma_token_here';
      console.log('✅ Using personal access token for design system access');
    }
    
    // Fetch the design system file
    const response = await axios.get(`https://api.figma.com/v1/files/${designSystemFileId}`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });
    
    console.log('✅ Design system file retrieved successfully');
    
    res.json({
      success: true,
      designSystem: response.data,
      fileId: designSystemFileId
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch design system:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch design system',
      details: error.message
    });
  }
});

module.exports = router;
