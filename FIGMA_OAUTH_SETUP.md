# Figma OAuth Setup Guide

This guide will help you set up Figma OAuth integration for the avinci-fiki platform.

## 1. Create Figma OAuth App

1. Go to [Figma Developer Settings](https://www.figma.com/developers/oauth)
2. Click "Create new OAuth app"
3. Fill in the app details:
   - **App name**: `avinci-fiki` or `MoneyView Design Converter`
   - **App description**: `AI-powered Figma to code conversion platform`
   - **App website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/admin/figma-callback`
4. **Important**: Select the scope `file_content:read`
5. Click "Create app"
6. **CRITICAL**: After creating, click "Publish" to make the app active

## 2. Environment Variables

Add these variables to your `.env` file:

```env
# Figma OAuth
FIGMA_CLIENT_ID=your_client_id_here
FIGMA_CLIENT_SECRET=your_client_secret_here
FIGMA_REDIRECT_URI=http://localhost:3000/admin/figma-callback
FIGMA_DESIGN_SYSTEM_ID=1224765904007984562

# Existing variables
BUILDER_API_KEY=50b9b8f9e05445158f041651360632d3
FIGMA_ACCESS_TOKEN=your_figma_token_here
```

## 3. Test the OAuth Flow

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/admin/enhanced-converter`
3. Click "🔐 Connect MoneyView" button
4. Complete the OAuth flow in the popup
5. You should be redirected back with success

## 4. Troubleshooting

### "Invalid scopes for app" Error
- Make sure you selected `file_content:read` scope
- **Important**: Re-publish your OAuth app after changing scopes
- Wait a few minutes for changes to propagate

### "Invalid redirect uri" Error
- Ensure the redirect URI in your Figma app matches exactly: `http://localhost:3000/admin/figma-callback`
- Check for typos and ensure no trailing slashes

### "Authentication Failed" Error
- Check that your Client ID and Client Secret are correct
- Ensure your OAuth app is published
- Verify the redirect URI matches exactly

## 5. API Endpoints

- `GET /api/figma-oauth/login` - Initiate OAuth flow
- `GET /api/figma-oauth/callback` - Handle OAuth callback
- `GET /api/figma-oauth/files` - Get user's Figma files
- `GET /api/figma-oauth/team-files` - Get team files
- `GET /api/figma-oauth/design-system` - Get MoneyView design system

## 6. Database

The OAuth tokens are stored in the `figma_oauth_tokens` table:

```sql
CREATE TABLE figma_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_in INTEGER,
    user_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 7. Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for all sensitive data
- Tokens are stored securely in the database
- Consider implementing token refresh logic for production

## 8. Production Deployment

For production deployment:

1. Update redirect URIs to your production domain
2. Use HTTPS for all OAuth URLs
3. Implement proper token refresh logic
4. Add rate limiting and security headers
5. Monitor OAuth usage and errors

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs for detailed error messages
3. Verify your Figma OAuth app settings
4. Ensure all environment variables are set correctly
