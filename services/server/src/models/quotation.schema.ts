const quotationSchema = `
  CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES user_profiles(id), 
    pricelist_id UUID REFERENCES pricelists(id) ON DELETE SET NULL,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'expired', 'cancelled')),
    valid_until DATE, 
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0, 
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0, 
    items JSONB NOT NULL DEFAULT '[]'::jsonb, 
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default quotationSchema;
