# Figma OAuth Redirect URI Fix

## 🚨 Current Issue
Getting error: `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`
- OAuth callback is trying to access: `/api/design/admin/oauth-callback`
- Should be accessing: `/api/figma-oauth/callback`

## ✅ Solution

### Step 1: Update Figma OAuth App Redirect URI

1. **Go to Figma OAuth App Settings**:
   - Visit: https://www.figma.com/developers/apps
   - Find your OAuth app with Client ID: `0voo2BWgpQYdBcjORTljog`

2. **Update Redirect URI**:
   - Go to "OAuth" section
   - Change redirect URI to: `http://localhost:3000/admin/figma-callback`
   - Remove any old redirect URIs like `/api/design/admin/oauth-callback`

3. **Save and Re-publish**:
   - Save the changes
   - Re-publish the OAuth app

### Step 2: Verify the Fix

1. **Check OAuth URL**:
   ```bash
   curl -X GET "http://localhost:3001/api/figma-oauth/login"
   ```
   - Should show: `redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Ffigma-callback`

2. **Test OAuth Flow**:
   - Go to: `http://localhost:3000/admin/enhanced-converter`
   - Click "Connect with Figma"
   - Should redirect to correct callback URL

## 🔧 Code Changes Made

- ✅ Updated redirect URI in backend code
- ✅ Updated documentation
- ✅ Verified callback endpoint works

## 📋 Current Configuration

- **Backend Callback**: `/api/figma-oauth/callback`
- **Frontend Route**: `/admin/figma-callback`
- **Redirect URI**: `http://localhost:3000/admin/figma-callback`

The OAuth flow should work perfectly after updating the redirect URI in Figma! 🚀
