const productSchema = `
  CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    sku VARCHAR(50) UNIQUE,
    category VARCHAR(100), 
    daily_rate DECIMAL(12,2) NOT NULL CHECK (daily_rate >= 0),
    deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default productSchema;
