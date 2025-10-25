-- Create design_prototypes table
CREATE TABLE IF NOT EXISTS design_prototypes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_key VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    ast JSONB NOT NULL,
    validation JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imported_by UUID REFERENCES admin_users(id),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_design_prototypes_file_key ON design_prototypes(file_key);
CREATE INDEX IF NOT EXISTS idx_design_prototypes_imported_by ON design_prototypes(imported_by);
CREATE INDEX IF NOT EXISTS idx_design_prototypes_product_id ON design_prototypes(product_id);
CREATE INDEX IF NOT EXISTS idx_design_prototypes_created_at ON design_prototypes(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Create updated_at trigger for design_prototypes
CREATE OR REPLACE FUNCTION update_design_prototypes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_design_prototypes_updated_at ON design_prototypes;
CREATE TRIGGER update_design_prototypes_updated_at
    BEFORE UPDATE ON design_prototypes
    FOR EACH ROW
    EXECUTE FUNCTION update_design_prototypes_updated_at();

-- Create updated_at trigger for products (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- Insert sample products
INSERT INTO products (id, name, description, category, status) VALUES
    (gen_random_uuid(), 'Mobile Banking App', 'Core banking application for mobile devices', 'Banking', 'active'),
    (gen_random_uuid(), 'Investment Platform', 'Investment and trading platform', 'Investment', 'active'),
    (gen_random_uuid(), 'Insurance Portal', 'Insurance management and claims portal', 'Insurance', 'active'),
    (gen_random_uuid(), 'Loan Management', 'Loan application and management system', 'Lending', 'active'),
    (gen_random_uuid(), 'Payment Gateway', 'Payment processing and gateway services', 'Payments', 'active')
ON CONFLICT (id) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE design_prototypes IS 'Stores Figma prototypes imported and parsed into AST format';
COMMENT ON COLUMN design_prototypes.file_key IS 'Figma file key used to identify the original file';
COMMENT ON COLUMN design_prototypes.name IS 'Human-readable name of the prototype';
COMMENT ON COLUMN design_prototypes.version IS 'Version number of the prototype';
COMMENT ON COLUMN design_prototypes.ast IS 'Abstract Syntax Tree representation of the Figma design';
COMMENT ON COLUMN design_prototypes.validation IS 'AI validation results including score, issues, and recommendations';
COMMENT ON COLUMN design_prototypes.imported_by IS 'User ID who imported the prototype';
COMMENT ON COLUMN design_prototypes.product_id IS 'Product ID this prototype belongs to';

COMMENT ON TABLE products IS 'Products that prototypes can be associated with';
COMMENT ON COLUMN products.name IS 'Product name';
COMMENT ON COLUMN products.description IS 'Product description';
COMMENT ON COLUMN products.category IS 'Product category (Banking, Investment, etc.)';
COMMENT ON COLUMN products.status IS 'Product status (active, inactive, etc.)';
