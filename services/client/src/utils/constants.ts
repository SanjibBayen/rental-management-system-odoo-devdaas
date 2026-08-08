// ============================================================
// App Constants
// ============================================================

export const APP_NAME = "RentFlow";
export const APP_VERSION = "1.0.0";

// ============================================================
// API Endpoints
// ============================================================

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    getMe: "/auth/me",
    logout: "/auth/logout",
    verifyOTP: "/auth/verify-otp",
    resendOTP: "/auth/resend-otp",
  },
  products: {
    all: "/products",
    categories: "/products/categories",
    brands: "/products/brands",
    byId: (id: string) => `/products/${id}`,
  },
  rentals: {
    all: "/rentals",
    user: "/rentals/user",
    active: "/rentals/active",
    overdue: "/rentals/overdue",
    byId: (id: string) => `/rentals/${id}`,
    return: (id: string) => `/rentals/${id}/return`,
    invoice: (id: string) => `/rentals/${id}/invoice`,
    confirmPayment: (id: string) => `/rentals/${id}/payment-confirm`,
  },
  users: {
    profile: "/users/profile",
    avatar: "/users/avatar",
  },
  dashboard: {
    stats: "/dashboard",
    recent: "/dashboard/recent",
    revenueChart: "/dashboard/revenue-chart",
  },
  pickups: {
    today: "/pickups/today",
    byId: (id: string) => `/pickups/${id}`,
    confirm: (id: string) => `/pickups/${id}/confirm`,
  },
  returns: {
    today: "/returns/today",
    byId: (id: string) => `/returns/${id}`,
    inspect: (id: string) => `/returns/${id}/inspect`,
    confirm: (id: string) => `/returns/${id}/confirm`,
  },
  quotations: {
    create: "/quotations",
    byId: (id: string) => `/quotations/${id}`,
    convert: (id: string) => `/quotations/${id}/convert`,
  },
  pricelists: {
    all: "/pricelists",
    byId: (id: string) => `/pricelists/${id}`,
  },
  ai: {
    predictiveMaintenance: (id: string) => `/ai/predictive-maintenance/${id}`,
    optimizeRoute: "/ai/optimize-route",
    forecast: (id: string) => `/ai/forecast/${id}`,
    smartReminder: "/ai/smart-reminder",
  },
};

// ============================================================
// Roles & Permissions
// ============================================================

export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  DELIVERY: "delivery",
} as const;

export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_ALL_RENTALS: "view_all_rentals",
  MANAGE_OWN_RENTALS: "manage_own_rentals",
  VIEW_ASSIGNED_DELIVERIES: "view_assigned_deliveries",
  UPDATE_DELIVERY_STATUS: "update_delivery_status",
} as const;

// ============================================================
// UI Constants
// ============================================================

export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_CURRENCY = "₹";
export const DATE_FORMAT = "dd MMM yyyy";
export const DATETIME_FORMAT = "dd MMM yyyy HH:mm";

// ============================================================
// Storage Keys
// ============================================================

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

// ============================================================
// AI Constants
// ============================================================

export const AI_SERVICE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8000";
