// ============================================================
// Currency Formatter
// ============================================================

export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatCurrencyCompact = (amount: number, currency: string = '₹'): string => {
  if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
};

// ============================================================
// Number Formatter
// ============================================================

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// ============================================================
// String Formatter
// ============================================================

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

export const truncate = (str: string, length: number = 50): string => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

// ============================================================
// Status Formatter
// ============================================================

export const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'text-success-teal bg-success-teal/10',
    pending: 'text-warning-amber bg-warning-amber/10',
    overdue: 'text-danger-red bg-danger-red/10',
    returned: 'text-primary bg-primary/10',
    cancelled: 'text-outline bg-surface-dim/50',
    completed: 'text-success-teal bg-success-teal/10',
    draft: 'text-outline bg-surface-dim/50',
    sent: 'text-primary bg-primary/10',
    paid: 'text-success-teal bg-success-teal/10',
    held: 'text-primary bg-primary/10',
    refunded: 'text-success-teal bg-success-teal/10',
    deducted: 'text-danger-red bg-danger-red/10',
  };
  return colors[status.toLowerCase()] || 'text-on-surface bg-surface-muted';
};

// ============================================================
// Address Formatter
// ============================================================

export const formatAddress = (address: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
};

// ============================================================
// Duration Formatter
// ============================================================

export const formatDuration = (days: number): string => {
  if (days === 1) return '1 day';
  return `${days} days`;
};