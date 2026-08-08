const rentalPeriodSchema = `
  CREATE TABLE IF NOT EXISTS rental_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    name VARCHAR(100) UNIQUE NOT NULL,
    duration_days INT NOT NULL CHECK (duration_days > 0), 
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default rentalPeriodSchema;
