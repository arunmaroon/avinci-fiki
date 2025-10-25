# Figma OAuth Authentication Debug Guide

## 🚨 Current Issue
- OAuth callback failing with "Authentication Failed"
- Token exchange returning 404 Not Found
- Possible OAuth app configuration issues

## 🔍 Debugging Steps

### 1. Check OAuth App Status
The OAuth app might not be properly published or configured:

1. **Go to Figma Developer Dashboard**:
   - Visit: https://www.figma.com/developers/apps
   - Check if your "avinci" app shows as "Published" or "Draft"

2. **Verify App Configuration**:
   - **Client ID**: `0voo2BWgpQYdBcjORTljog`
   - **Redirect URI**: `http://localhost:3000/admin/figma-callback`
   - **Scopes**: `file_content:read`

3. **Re-publish if needed**:
   - If the app is in "Draft" status, click "Publish"
   - This is required for OAuth to work

### 2. Test OAuth Flow Manually

1. **Get Authorization URL**:
   ```bash
   curl -X GET "http://localhost:3001/api/figma-oauth/login"
   ```

2. **Copy the authUrl and open in browser**:
   - Complete the OAuth flow manually
   - Check if you get redirected to the correct callback URL

3. **Check callback parameters**:
   - Look for `code` and `state` parameters in the callback URL
   - Note any error messages

### 3. Common Issues & Solutions

#### Issue: 404 on Token Exchange
**Cause**: OAuth app not published or wrong endpoint
**Solution**: 
- Publish the OAuth app in Figma
- Verify the app is active

#### Issue: Invalid Redirect URI
**Cause**: Mismatch between configured and requested URI
**Solution**:
- Update Figma app settings with correct redirect URI
- Ensure exact match: `http://localhost:3000/admin/figma-callback`

#### Issue: Invalid Scopes
**Cause**: Requested scopes not enabled in app
**Solution**:
- Enable `file_content:read` scope in Figma app
- Re-publish the app

#### Issue: State Parameter Mismatch
**Cause**: Session not maintained between requests
**Solution**:
- Check if session middleware is working
- For demo, we skip state validation

### 4. Test with Real OAuth Flow

1. **Start OAuth Flow**:
   - Go to: `http://localhost:3000/admin/enhanced-converter`
   - Click "Connect with Figma"

2. **Complete Authentication**:
   - Authorize the app in Figma
   - Check if callback receives valid code

3. **Check Server Logs**:
   - Look for detailed error messages
   - Verify token exchange process

## 🔧 Current Configuration

- **OAuth URL**: `https://www.figma.com/oauth?client_id=0voo2BWgpQYdBcjORTljog&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Ffigma-callback&scope=file_content:read&state=...`
- **Token Endpoint**: `https://www.figma.com/oauth/token`
- **Callback Route**: `/api/figma-oauth/callback`
- **Frontend Route**: `/admin/figma-callback`

## 📋 Next Steps

1. **Verify OAuth app is published** in Figma
2. **Test complete OAuth flow** manually
3. **Check server logs** for specific errors
4. **Update configuration** if needed

The OAuth flow should work once the app is properly published! 🚀
