const cartSchema = `
  CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'converted', 'abandoned')),
    currency_code CHAR(3) NOT NULL DEFAULT 'INR', 
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    expires_at TIMESTAMPTZ, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default cartSchema;
