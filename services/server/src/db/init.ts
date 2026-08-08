import { query } from '../config/database';
import {
  addressSchema, auditLogSchema, cartSchema, inspectionSchema, invoiceSchema, lateFeeSchema,
  organizationSchema, paymentSchema, pickupSchema, pricelistSchema, productSchema,
  productVariantSchema, quotationSchema, rentalAssetSchema, rentalOrderSchema,
  rentalPeriodSchema, returnSchema, securityDepositSchema, userSchema,
} from '../models';
import { emailVerificationSchema } from '../models/emailVerification.model';

/** Creates the rental domain tables in foreign-key dependency order. */
export async function initializeDatabase() {
  const schemas = [
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    organizationSchema,
    userSchema,
    addressSchema,
    productSchema,
    productVariantSchema,
    rentalAssetSchema,
    rentalPeriodSchema,
    pricelistSchema,
    cartSchema,
    quotationSchema,
    rentalOrderSchema,
    paymentSchema,
    invoiceSchema,
    securityDepositSchema,
    lateFeeSchema,
    pickupSchema,
    returnSchema,
    inspectionSchema,
    auditLogSchema,
    emailVerificationSchema,
  ];


  try {
    for (const schema of schemas) await query(schema);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
