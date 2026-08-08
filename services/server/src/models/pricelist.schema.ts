const pricelistSchema = `
  CREATE TABLE IF NOT EXISTS pricelists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, 
    currency_code CHAR(3) NOT NULL DEFAULT 'INR', 
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    valid_from DATE, valid_to DATE, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
  );`;

export default pricelistSchema;
