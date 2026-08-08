const returnSchema = `
  CREATE TABLE IF NOT EXISTS returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL UNIQUE REFERENCES rentals(id) ON DELETE CASCADE,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL, 
    scheduled_at TIMESTAMPTZ, received_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'received', 'inspected', 'cancelled')),
    received_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, 
    notes TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default returnSchema;
