-- Create vision_conversions table for AI Vision conversions
CREATE TABLE IF NOT EXISTS vision_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_path TEXT NOT NULL,
    image_name TEXT,
    framework TEXT NOT NULL DEFAULT 'react',
    styling TEXT NOT NULL DEFAULT 'tailwind',
    component_type TEXT NOT NULL DEFAULT 'component',
    ai_provider TEXT NOT NULL DEFAULT 'auto',
    custom_prompt TEXT,
    generated_code TEXT,
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    status TEXT DEFAULT 'completed',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vision_conversions_created_at ON vision_conversions (created_at);
CREATE INDEX IF NOT EXISTS idx_vision_conversions_framework ON vision_conversions (framework);
CREATE INDEX IF NOT EXISTS idx_vision_conversions_ai_provider ON vision_conversions (ai_provider);

-- Add comment
COMMENT ON TABLE vision_conversions IS 'Stores AI Vision design-to-code conversion history';
