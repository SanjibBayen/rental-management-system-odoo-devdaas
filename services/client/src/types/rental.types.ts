export type RentalStatus = 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled';

export type PaymentType = 'deposit' | 'rental_fee' | 'late_fee' | 'refund';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Rental {
  id: string;
  rentalNumber: string;
  userId: string;
  productId: string;
  productName?: string;
  productImage?: string;
  customerName?: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  status: RentalStatus;
  totalAmount: number;
  depositAmount: number;
  lateFee: number;
  refundAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRentalData {
  productId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  depositAmount: number;
}

export interface ReturnRentalData {
  returnDate: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  damageReport?: string;
  missingAccessories?: string;
}

export interface PaymentConfirmData {
  paymentId: string;
  status: PaymentStatus;
  amount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  rentalId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}