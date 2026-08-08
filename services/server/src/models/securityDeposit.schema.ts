const securityDepositSchema = `
  CREATE TABLE IF NOT EXISTS security_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id), 
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'refunded', 'deducted', 'partial_refund')),
    refund_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0), 
    deduction_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (deduction_amount >= 0),
    held_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    resolved_at TIMESTAMPTZ, notes TEXT
  );`;

export default securityDepositSchema;
