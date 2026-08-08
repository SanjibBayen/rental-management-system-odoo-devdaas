import React, { useState, useEffect } from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import Modal from '../../components/Modal';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  activeRentals: number;
  totalSpent: number;
  createdAt: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Use your real API endpoint for fetching customers
      // If you don't have /users/customers yet, you can use /users (admin only)
      const response = await api.users.getAll ? await api.users.getAll() : await fetch('/api/users');
      
      // Handle the response based on your API structure
      let customerData = [];
      if (response && response.data) {
        customerData = response.data;
      } else if (Array.isArray(response)) {
        customerData = response;
      }
      
      // Filter only customers (role === 'customer')
      const filteredCustomers = customerData
        .filter((user: any) => user.role === 'customer')
        .map((user: any) => ({
          id: user.id,
          name: user.full_name || user.name || 'Unknown',
          email: user.email,
          phone: user.phone || '—',
          company: user.company || '—',
          activeRentals: user.activeRentals || 0,
          totalSpent: user.totalSpent || 0,
          createdAt: user.created_at || new Date().toISOString(),
        }));
      
      setCustomers(filteredCustomers);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading customers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="text-center py-20">
          <p className="text-danger-red font-bold">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Customers</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">View and manage customer accounts and history.</p>
        </div>
        <div className="text-sm text-on-surface-variant">
          {customers.length} customers found
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border-standard">
          <p className="text-on-surface-variant">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white border border-border-standard rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                  {customer.name.charAt(0)}
                </div>
                <button 
                  onClick={() => { setSelectedCustomer(customer); setIsProfileModalOpen(true); }}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-primary/10 rounded-md"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg text-on-surface leading-tight truncate">{customer.name}</h3>
              <p className="text-on-surface-variant text-sm mb-4 truncate">{customer.company}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium truncate">
                  <Mail className="w-4 h-4 text-outline shrink-0" /> {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium truncate">
                  <Phone className="w-4 h-4 text-outline shrink-0" /> {customer.phone}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-standard">
                <div>
                  <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Active Rentals</div>
                  <div className="font-bold text-base text-on-surface mt-0.5">{customer.activeRentals}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Total Spent</div>
                  <div className="font-bold text-base text-primary mt-0.5">{formatCurrency(customer.totalSpent)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Customer Profile">
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-surface-muted p-4 rounded-xl border border-border-standard">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">{selectedCustomer.name}</h3>
                <p className="text-outline font-medium text-sm">{selectedCustomer.company}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Email</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.email}</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Phone</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.phone}</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Active Rentals</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.activeRentals}</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Total Spent</div>
                <div className="text-sm font-bold text-primary">{formatCurrency(selectedCustomer.totalSpent)}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity">
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}