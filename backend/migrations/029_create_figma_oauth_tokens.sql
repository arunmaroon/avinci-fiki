-- Create figma_oauth_tokens table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS figma_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_in INTEGER,
    user_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_figma_oauth_tokens_user_id ON figma_oauth_tokens(user_id);

-- Add comments
COMMENT ON TABLE figma_oauth_tokens IS 'Stores Figma OAuth tokens for authenticated users';
COMMENT ON COLUMN figma_oauth_tokens.access_token IS 'Figma API access token';
COMMENT ON COLUMN figma_oauth_tokens.refresh_token IS 'Figma API refresh token';
COMMENT ON COLUMN figma_oauth_tokens.user_info IS 'Figma user profile information';
COMMENT ON COLUMN figma_oauth_tokens.expires_in IS 'Token expiration time in seconds';
