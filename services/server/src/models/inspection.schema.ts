const inspectionSchema = `
  CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES rental_assets(id) ON DELETE SET NULL, 
    inspection_type VARCHAR(20) NOT NULL CHECK (inspection_type IN ('pickup', 'return', 'maintenance')),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
    damage_report TEXT, 
    images JSONB NOT NULL DEFAULT '[]'::jsonb, 
    estimated_charge DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (estimated_charge >= 0),
    inspected_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, 
    inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default inspectionSchema;
