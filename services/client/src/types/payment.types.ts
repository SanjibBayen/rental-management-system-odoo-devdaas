import { PaymentStatus, PaymentType } from './rental.types';

export interface Payment {
  id: string;
  rentalId: string;
  userId: string;
  amount: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentData {
  rentalId: string;
  userId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod?: string;
  transactionId?: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  totalDeposits: number;
  totalLateFees: number;
  totalRefunds: number;
}

export interface RazorpayPaymentData {
  paymentId: string;
  orderId: string;
  signature: string;
  amount: number;
}