-- Create figma_conversions table
CREATE TABLE IF NOT EXISTS figma_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_key VARCHAR(255) NOT NULL,
    node_id VARCHAR(255),
    json_output JSONB,
    design_system VARCHAR(50),
    react_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create design_tokens table
CREATE TABLE IF NOT EXISTS design_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_name VARCHAR(100) NOT NULL,
    tokens JSONB NOT NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_figma_conversions_file_key ON figma_conversions(file_key);
CREATE INDEX IF NOT EXISTS idx_figma_conversions_node_id ON figma_conversions(node_id);
CREATE INDEX IF NOT EXISTS idx_figma_conversions_created_at ON figma_conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_figma_conversions_design_system ON figma_conversions(design_system);
CREATE INDEX IF NOT EXISTS idx_design_tokens_system_name ON design_tokens(system_name);
CREATE INDEX IF NOT EXISTS idx_design_tokens_version ON design_tokens(version);

-- Create updated_at trigger for design_tokens
CREATE OR REPLACE FUNCTION update_design_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_design_tokens_updated_at ON design_tokens;
CREATE TRIGGER update_design_tokens_updated_at
    BEFORE UPDATE ON design_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_design_tokens_updated_at();

-- Insert sample design tokens
INSERT INTO design_tokens (id, system_name, tokens, version) VALUES
    (gen_random_uuid(), 'moneyview', '{
        "color": {
            "primary": {"value": "#0066FF"},
            "secondary": {"value": "#00CC88"},
            "success": {"value": "#00CC88"},
            "warning": {"value": "#FFB800"},
            "error": {"value": "#FF4444"},
            "neutral": {"value": "#6B7280"}
        },
        "spacing": {
            "xs": {"value": "4px"},
            "sm": {"value": "8px"},
            "md": {"value": "16px"},
            "lg": {"value": "24px"},
            "xl": {"value": "32px"}
        },
        "typography": {
            "heading1": {
                "fontFamily": {"value": "Inter"},
                "fontSize": {"value": "32px"},
                "fontWeight": {"value": 700}
            },
            "body": {
                "fontFamily": {"value": "Inter"},
                "fontSize": {"value": "16px"},
                "fontWeight": {"value": 400}
            }
        }
    }', '1.0.0'),
    (gen_random_uuid(), 'material', '{
        "color": {
            "primary": {"value": "#1976D2"},
            "secondary": {"value": "#DC004E"},
            "success": {"value": "#4CAF50"},
            "warning": {"value": "#FF9800"},
            "error": {"value": "#F44336"},
            "neutral": {"value": "#757575"}
        },
        "spacing": {
            "xs": {"value": "4px"},
            "sm": {"value": "8px"},
            "md": {"value": "16px"},
            "lg": {"value": "24px"},
            "xl": {"value": "32px"}
        },
        "typography": {
            "heading1": {
                "fontFamily": {"value": "Roboto"},
                "fontSize": {"value": "32px"},
                "fontWeight": {"value": 700}
            },
            "body": {
                "fontFamily": {"value": "Roboto"},
                "fontSize": {"value": "16px"},
                "fontWeight": {"value": 400}
            }
        }
    }', '1.0.0')
ON CONFLICT (id) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE figma_conversions IS 'Stores Figma to JSON/React conversions';
COMMENT ON COLUMN figma_conversions.file_key IS 'Figma file key used for conversion';
COMMENT ON COLUMN figma_conversions.node_id IS 'Specific Figma node ID (optional)';
COMMENT ON COLUMN figma_conversions.json_output IS 'Converted JSON output';
COMMENT ON COLUMN figma_conversions.design_system IS 'Design system used for conversion';
COMMENT ON COLUMN figma_conversions.react_code IS 'Generated React component code';

COMMENT ON TABLE design_tokens IS 'Design system tokens and variables';
COMMENT ON COLUMN design_tokens.system_name IS 'Name of the design system';
COMMENT ON COLUMN design_tokens.tokens IS 'Design tokens in JSON format';
COMMENT ON COLUMN design_tokens.version IS 'Version of the design system';

