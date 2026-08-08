const rentalOrderSchema = `
  CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    asset_id UUID REFERENCES rental_assets(id) ON DELETE SET NULL, 
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    pricelist_id UUID REFERENCES pricelists(id) ON DELETE SET NULL, 
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL,
    actual_return_date DATE, 
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'active', 'overdue', 'returned', 'cancelled')),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0), 
    deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    late_fee DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (late_fee >= 0), 
    refund_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
    notes TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_date >= start_date)
  );`;

export default rentalOrderSchema;
