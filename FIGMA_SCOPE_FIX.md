# Figma OAuth Scope Fix

## ❌ Error: "Invalid scopes for app"

This error occurs when the Figma OAuth app doesn't have the correct scopes configured.

## ✅ Solution

### 1. Update Your Figma OAuth App

1. Go to [Figma OAuth Apps](https://www.figma.com/developers/oauth)
2. Find your "MoneyView Design Converter" app
3. Click "Edit" or "Settings"
4. Update the **Scopes** field to: `file_content:read`
5. Click "Save" or "Update"

### 2. Re-publish Your App

After updating the scopes, you need to re-publish your OAuth app:

1. In your OAuth app settings
2. Look for "Publish" or "Make Live" button
3. Click it to apply the scope changes
4. Wait a few minutes for changes to propagate

### 3. Test the Authentication

1. Go to `http://localhost:3000/admin/enhanced-converter`
2. Click "🔐 Connect MoneyView"
3. Complete the OAuth flow
4. You should now see "✅ MoneyView Connected"

## 🔧 Alternative Scopes to Try

If `file_content:read` doesn't work, try these scopes in order:

1. `file_content:read` (recommended)
2. `files:read`
3. `file_read`

## 📝 Complete OAuth App Configuration

Your Figma OAuth app should have:

- **App Name**: MoneyView Design Converter
- **Description**: Convert Figma designs to React components
- **Redirect URI**: `http://localhost:3000/admin/figma-callback`
- **Scopes**: `file_content:read`
- **Status**: Published/Live

## 🚨 Important Notes

- **Scope changes require re-publishing** the OAuth app
- **Wait 2-3 minutes** after publishing for changes to take effect
- **Clear browser cache** if you still see the old error
- **Check the Figma developer console** for any additional errors

## ✅ Verification

Once fixed, you should see:
- No "Invalid scopes" error
- Successful OAuth authentication
- Access to MoneyView design system components
- Design system components showing in the preview with 🎨 icons
