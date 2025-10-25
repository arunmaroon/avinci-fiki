# Figma OAuth "Invalid scopes" Fix

## 🚨 Current Issue
Getting error: `{"error":true,"status":400,"message":"Invalid scopes for app","i18n":null}`

## ✅ Solution

### Step 1: Update Figma OAuth App Settings

1. **Go to Figma Developer Dashboard**:
   - Visit: https://www.figma.com/developers/apps
   - Find your OAuth app with Client ID: `0voo2BWgpQYdBcjORTljog`

2. **Update Scopes**:
   - Click on your OAuth app
   - Go to "OAuth" section
   - Enable the `file_content:read` scope
   - Save the changes

3. **Re-publish the App**:
   - After updating scopes, click "Re-publish" or "Update"
   - This is **required** for scope changes to take effect

### Step 2: Verify the Fix

1. **Test OAuth URL**:
   ```bash
   curl -X GET "http://localhost:3001/api/figma-oauth/login"
   ```

2. **Check the URL**:
   - Should include `scope=file_content:read`
   - Should not include `scope=file_read`

3. **Test in Browser**:
   - Go to: `http://localhost:3000/admin/enhanced-converter`
   - Click "Connect with Figma"
   - Should now work without scope error

## 🔧 Code Changes Made

- ✅ Updated scope from `file_read` to `file_content:read`
- ✅ Updated documentation
- ✅ Added troubleshooting guide

## 📋 Next Steps

1. **Update Figma app settings** (as described above)
2. **Re-publish the OAuth app**
3. **Test the OAuth flow**
4. **Verify file access works**

The OAuth flow should work perfectly after updating the Figma app settings! 🚀
