const rentalAssetSchema = `
  CREATE TABLE IF NOT EXISTS rental_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, 
    asset_tag VARCHAR(100) UNIQUE NOT NULL,
    serial_number VARCHAR(100), 
    condition_status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (condition_status IN ('available', 'reserved', 'rented', 'maintenance', 'retired')),
    purchase_cost DECIMAL(12,2), 
    notes TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default rentalAssetSchema;
