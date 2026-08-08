const pickupSchema = `
  CREATE TABLE IF NOT EXISTS pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL UNIQUE REFERENCES rentals(id) ON DELETE CASCADE,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL, 
    scheduled_at TIMESTAMPTZ NOT NULL, 
    completed_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    handled_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, 
    notes TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default pickupSchema;
