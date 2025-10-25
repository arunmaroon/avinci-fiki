const axios = require('axios');
const { redis } = require('../models/database');

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const OAUTH_BASE = 'https://www.figma.com/oauth';

function requireEnv() {
  if (process.env.DESIGN_FEATURE_ENABLED === 'true') {
    if (!process.env.FIGMA_CLIENT_ID || !process.env.FIGMA_CLIENT_SECRET) {
      throw new Error('FIGMA_CLIENT_ID and FIGMA_CLIENT_SECRET are required when DESIGN_FEATURE_ENABLED=true');
    }
  }
}

function getOAuthUrl(state) {
  const redirect = encodeURIComponent(process.env.FIGMA_REDIRECT_URI || 'http://localhost:3000/admin/figma-callback');
  const scope = encodeURIComponent('file:read');
  return `${OAUTH_BASE}?client_id=${process.env.FIGMA_CLIENT_ID}&redirect_uri=${redirect}&scope=${scope}&state=${state}&response_type=code`; 
}

async function exchangeCodeForToken(code) {
  const res = await axios.post('https://www.figma.com/api/oauth/token', null, {
    params: {
      client_id: process.env.FIGMA_CLIENT_ID,
      client_secret: process.env.FIGMA_CLIENT_SECRET,
      redirect_uri: process.env.FIGMA_REDIRECT_URI || 'http://localhost:3000/admin/figma-callback',
      code,
      grant_type: 'authorization_code'
    }
  });
  return res.data; // { access_token, refresh_token, expires_in }
}

async function storeTokenForState(state, data) {
  await redis.connect().catch(() => {});
  await redis.setEx(`figma:oauth:${state}`, 3600, JSON.stringify(data));
}

async function getTokenForState(state) {
  await redis.connect().catch(() => {});
  const raw = await redis.get(`figma:oauth:${state}`);
  return raw ? JSON.parse(raw) : null;
}

async function getFigmaFile(fileKey, token) {
  const res = await axios.get(`${FIGMA_API_BASE}/files/${fileKey}`, {
    headers: { 'X-Figma-Token': token }
  });
  return res.data;
}

module.exports = {
  FIGMA_API_BASE,
  getOAuthUrl,
  exchangeCodeForToken,
  getFigmaFile,
  storeTokenForState,
  getTokenForState,
  requireEnv
};


