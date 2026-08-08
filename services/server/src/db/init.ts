import { query } from '../config/database';

export async function initializeDatabase() {
  const sql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'delivery')),
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      sku VARCHAR(50) UNIQUE,
      category VARCHAR(100),
      daily_rate DECIMAL(10,2) NOT NULL,
      deposit_amount DECIMAL(10,2) NOT NULL,
      stock_quantity INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      rental_number VARCHAR(50) UNIQUE NOT NULL,
      user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      actual_return_date DATE,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'overdue', 'returned', 'cancelled')),
      total_amount DECIMAL(10,2) NOT NULL,
      deposit_amount DECIMAL(10,2) NOT NULL,
      late_fee DECIMAL(10,2) DEFAULT 0,
      refund_amount DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES user_profiles(id),
      amount DECIMAL(10,2) NOT NULL,
      payment_type VARCHAR(20) CHECK (payment_type IN ('deposit', 'rental_fee', 'late_fee', 'refund')),
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS security_deposits (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES user_profiles(id),
      amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'held' CHECK (status IN ('held', 'refunded', 'deducted', 'partial_refund')),
      refund_amount DECIMAL(10,2) DEFAULT 0,
      deduction_amount DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_number VARCHAR(50) UNIQUE NOT NULL,
      rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES user_profiles(id),
      issue_date DATE DEFAULT CURRENT_DATE,
      due_date DATE NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await query(sql);
    console.log(' Database tables initialized successfully');
  } catch (error) {
    console.error(' Database initialization failed:', error);
    throw error;
  }
}