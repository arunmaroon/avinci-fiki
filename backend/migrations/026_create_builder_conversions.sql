-- Create builder_conversions table
CREATE TABLE IF NOT EXISTS builder_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_data JSONB,
    builder_blocks JSONB,
    react_code TEXT,
    preview_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_builder_conversions_created_at ON builder_conversions (created_at);

-- Add comment
COMMENT ON TABLE builder_conversions IS 'Stores Builder.io design conversion history';

