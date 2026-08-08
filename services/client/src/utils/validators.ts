// ============================================================
// Email Validator
// ============================================================

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// ============================================================
// Password Validator
// ============================================================

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isStrongPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// ============================================================
// Phone Validator
// ============================================================

export const isValidPhone = (phone: string): boolean => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(phone);
};

// ============================================================
// Name Validator
// ============================================================

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// ============================================================
// URL Validator
// ============================================================

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================
// Date Validator
// ============================================================

export const isValidDate = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(d.getTime());
};

export const isStartDateBeforeEndDate = (startDate: string, endDate: string): boolean => {
  return new Date(startDate) < new Date(endDate);
};

export const isDateWithinRange = (date: string, startDate: string, endDate: string): boolean => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

// ============================================================
// Price Validator
// ============================================================

export const isValidPrice = (price: number): boolean => {
  return price >= 0;
};

// ============================================================
// Quantity Validator
// ============================================================

export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0;
};

// ============================================================
// Rental Period Validator
// ============================================================

export const isValidRentalPeriod = (startDate: string, endDate: string): boolean => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  if (!isStartDateBeforeEndDate(startDate, endDate)) return false;
  const days = daysBetween(startDate, endDate);
  return days >= 1;
};

// ============================================================
// OTP Validator
// ============================================================

export const isValidOTP = (otp: string): boolean => {
  return /^[0-9]{6}$/.test(otp);
};

// ============================================================
// Empty / Required Validator
// ============================================================

export const isNotEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// ============================================================
// Form Validation Helpers
// ============================================================

export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => boolean | string>
): Record<keyof T, string> => {
  const errors: Record<keyof T, string> = {} as any;
  
  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    if (typeof result === 'string') {
      errors[field as keyof T] = result;
    } else if (result === false) {
      errors[field as keyof T] = `${String(field)} is invalid`;
    }
  }
  
  return errors;
};

// ============================================================
// Helper for validators that use dateHelpers
// ============================================================

function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}