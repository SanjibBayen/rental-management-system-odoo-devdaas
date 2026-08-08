const addressSchema = `
  CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL DEFAULT 'Primary',
    address_type VARCHAR(20) NOT NULL DEFAULT 'billing' CHECK (address_type IN ('billing', 'shipping', 'pickup', 'return')),
    line1 VARCHAR(255) NOT NULL, 
    line2 VARCHAR(255), 
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100), 
    postal_code VARCHAR(20), 
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    latitude DECIMAL(10,7), 
    longitude DECIMAL(10,7), 
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (user_id IS NOT NULL OR organization_id IS NOT NULL)
  );`;

export default addressSchema;
