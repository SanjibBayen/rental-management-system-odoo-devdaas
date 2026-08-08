const lateFeeSchema = `
  CREATE TABLE IF NOT EXISTS late_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0), 
    daily_rate DECIMAL(12,2) NOT NULL CHECK (daily_rate >= 0),
    overdue_days INT NOT NULL CHECK (overdue_days >= 0), 
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'waived')),
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    paid_at TIMESTAMPTZ, notes TEXT
  );`;

export default lateFeeSchema;
