const invoiceSchema = `
  CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE, 
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE, 
    due_date DATE NOT NULL, 
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0), 
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    CHECK (due_date >= issue_date)
  );`;

export default invoiceSchema;
