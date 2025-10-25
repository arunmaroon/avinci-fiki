-- Create figma_ui_conversions table
CREATE TABLE IF NOT EXISTS figma_ui_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    figma_url TEXT NOT NULL,
    component_name TEXT,
    figma_data JSONB,
    ui_html TEXT,
    components JSONB,
    frames JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_figma_ui_conversions_created_at ON figma_ui_conversions (created_at);
CREATE INDEX IF NOT EXISTS idx_figma_ui_conversions_figma_url ON figma_ui_conversions (figma_url);

-- Add comment
COMMENT ON TABLE figma_ui_conversions IS 'Stores Figma prototype to UI conversion history';

