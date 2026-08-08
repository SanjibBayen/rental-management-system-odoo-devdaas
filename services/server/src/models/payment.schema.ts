const paymentSchema = `
  CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id), 
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0), 
    currency_code CHAR(3) NOT NULL DEFAULT 'INR',
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'rental_fee', 'late_fee', 'refund')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    provider VARCHAR(50), 
    provider_reference VARCHAR(255), 
    paid_at TIMESTAMPTZ, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default paymentSchema;
