const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json().catch(() => ({}));
};

export const api = {
  // 1. Auth Routes
  auth: {
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request('/auth/me', { method: 'GET' }),
  },
  
  // 2. Product Routes
  products: {
    getAll: () => request('/products', { method: 'GET' }),
    getById: (id: string) => request(`/products/${id}`, { method: 'GET' }),
    create: (data: any) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  },

  // 3. Rental Routes
  rentals: {
    getAll: () => request('/rentals', { method: 'GET' }),
    getById: (id: string) => request(`/rentals/${id}`, { method: 'GET' }),
    create: (data: any) => request('/rentals', { method: 'POST', body: JSON.stringify(data) }),
    returnRental: (id: string, data: any) => request(`/rentals/${id}/return`, { method: 'PUT', body: JSON.stringify(data) }),
    getUserRentals: () => request('/rentals/user', { method: 'GET' }),
    getActive: () => request('/rentals/active', { method: 'GET' }),
    getOverdue: () => request('/rentals/overdue', { method: 'GET' }),
    getInvoice: (id: string) => request(`/rentals/${id}/invoice`, { method: 'GET' }),
    confirmPayment: (id: string, data: any) => request(`/rentals/${id}/payment-confirm`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // 4. User Routes
  users: {
    getProfile: () => request('/users/profile', { method: 'GET' }),
    updateProfile: (data: any) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    updateAvatar: (data: any) => request('/users/avatar', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // 5. Dashboard Routes
  dashboard: {
    getStats: () => request('/dashboard', { method: 'GET' }),
    getStatsAlias: () => request('/dashboard/stats', { method: 'GET' }),
  },

  // 6. Pickup Routes
  pickups: {
    getToday: () => request('/pickups/today', { method: 'GET' }),
    getById: (id: string) => request(`/pickups/${id}`, { method: 'GET' }),
    confirm: (id: string, data: any = {}) => request(`/pickups/${id}/confirm`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // 7. Return Routes
  returns: {
    getToday: () => request('/returns/today', { method: 'GET' }),
    getById: (id: string) => request(`/returns/${id}`, { method: 'GET' }),
    inspect: (id: string, data: any) => request(`/returns/${id}/inspect`, { method: 'PUT', body: JSON.stringify(data) }),
    confirm: (id: string, data: any = {}) => request(`/returns/${id}/confirm`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // 8. Quotation Routes
  quotations: {
    create: (data: any) => request('/quotations', { method: 'POST', body: JSON.stringify(data) }),
    getById: (id: string) => request(`/quotations/${id}`, { method: 'GET' }),
    convertToRental: (id: string, data: any = {}) => request(`/quotations/${id}/convert`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // 9. Pricelist Routes
  pricelists: {
    getAll: () => request('/pricelists', { method: 'GET' }),
    getById: (id: string) => request(`/pricelists/${id}`, { method: 'GET' }),
    create: (data: any) => request('/pricelists', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/pricelists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/pricelists/${id}`, { method: 'DELETE' }),
  }
};