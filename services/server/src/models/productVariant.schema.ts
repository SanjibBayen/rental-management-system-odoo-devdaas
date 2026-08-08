const productVariantSchema = `
  CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(80) UNIQUE, 
    name VARCHAR(255) NOT NULL, 
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    daily_rate DECIMAL(12,2), 
    deposit_amount DECIMAL(12,2), 
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (daily_rate IS NULL OR daily_rate >= 0), 
    CHECK (deposit_amount IS NULL OR deposit_amount >= 0)
  );`;

export default productVariantSchema;
