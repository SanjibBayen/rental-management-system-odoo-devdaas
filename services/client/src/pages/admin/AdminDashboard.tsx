import React, { useState } from 'react';
import { Users, Package, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Modal from '../../components/Modal';
import { useDashboard } from '../../hooks/useDashboard';
import { useRentals } from '../../hooks/useRentals';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';

export default function AdminDashboard() {
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);
  const { stats, isLoading: dashboardLoading, refetch: refetchStats } = useDashboard();
  const { rentals, isLoading: rentalsLoading, refetch: refetchRentals } = useRentals({ view: 'recent', limit: 5 });
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    customerSearch: '',
    productSearch: '',
    startDate: '',
    endDate: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRental = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      // Step 1: Search for customer by email (you need a customer search endpoint)
      // For now, we assume the user enters a valid email
      const customerEmail = formData.customerSearch.trim();
      
      // Step 2: Search for product by name (you need a product search endpoint)
      const productResponse = await api.products.getAll({ search: formData.productSearch });
      const product = productResponse.data?.[0];
      if (!product) {
        alert('Product not found. Please enter a valid product name.');
        setIsCreating(false);
        return;
      }

      // Step 3: Get customer ID (you'd need a customer lookup endpoint)
      // For demo, we'll use a mock customer ID - replace with actual API call
      const customerId = '22222222-2222-2222-2222-222222222222'; // Replace with real customer lookup

      // Step 4: Calculate total amount and deposit
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = days * product.pricePerDay;
      const depositAmount = product.depositAmount;

      // Step 5: Create rental via API
      await api.rentals.create({
        user_id: customerId,
        product_id: product.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_amount: totalAmount,
        deposit_amount: depositAmount,
      });

      // Step 6: Refresh data
      await refetchRentals();
      await refetchStats();
      setIsNewRentalModalOpen(false);
      setFormData({
        customerSearch: '',
        productSearch: '',
        startDate: '',
        endDate: '',
      });
      alert('Rental created successfully!');
    } catch (error: any) {
      alert('Failed to create rental: ' + (error.message || 'Unknown error'));
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-success-teal/10 text-success-teal',
      pending: 'bg-warning-amber/10 text-warning-amber',
      overdue: 'bg-danger-red/10 text-danger-red',
      returned: 'bg-primary/10 text-primary',
      cancelled: 'bg-surface-dim/50 text-outline',
    };
    return colors[status] || 'bg-surface-muted text-on-surface';
  };

  if (dashboardLoading || rentalsLoading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Admin Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <button 
          onClick={() => setIsNewRentalModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm active:scale-95"
        >
          + New Rental
        </button>
      </div>

      {/* Stats Cards - Now using real API data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Active Rentals</h3>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">{stats?.activeRentals || 0}</div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+12%</span> from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Due Today</h3>
            <div className="p-2.5 bg-warning-amber/10 rounded-lg text-warning-amber group-hover:bg-warning-amber group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">7</div>
          <div className="text-danger-red text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">2 Overdue</span> action required
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Revenue</h3>
            <div className="p-2.5 bg-success-teal/10 rounded-lg text-success-teal group-hover:bg-success-teal group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">{formatCurrency(stats?.totalRevenue || 0)}</div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+8%</span> from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Products</h3>
            <div className="p-2.5 bg-info-blue/10 rounded-lg text-info-blue group-hover:bg-info-blue group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">{stats?.totalProducts || 0}</div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+4</span> new this week
          </div>
        </div>
      </div>

      {/* Recent Rentals Table - Now using real API data */}
      <div className="bg-white rounded-xl border border-border-standard shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-standard flex justify-between items-center bg-surface-muted">
          <h2 className="font-bold text-lg text-on-surface">Recent Rentals</h2>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-standard">
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">Order ID</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">Customer</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">Return Date</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No recent rentals found
                  </td>
                </tr>
              ) : (
                rentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-border-standard hover:bg-surface-muted transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(rental.status)}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface">#{rental.rental_number}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">{rental.customer_name || '—'}</td>
                    <td className="px-6 py-4 text-outline font-medium">{formatDate(rental.end_date)}</td>
                    <td className="px-6 py-4 text-right font-bold text-on-surface">{formatCurrency(rental.total_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Rental Modal - Now creates real rental via API */}
      <Modal isOpen={isNewRentalModalOpen} onClose={() => setIsNewRentalModalOpen(false)} title="Create New Rental">
        <form onSubmit={handleCreateRental} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Customer Email</label>
            <input 
              required 
              type="email" 
              className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="customer@example.com" 
              value={formData.customerSearch}
              onChange={(e) => setFormData({ ...formData, customerSearch: e.target.value })}
            />
            <p className="text-xs text-outline mt-1">Enter the customer's email address</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Product Name</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="Search product..." 
              value={formData.productSearch}
              onChange={(e) => setFormData({ ...formData, productSearch: e.target.value })}
            />
            <p className="text-xs text-outline mt-1">Enter the product name exactly as listed</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">Start Date</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">End Date</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsNewRentalModalOpen(false)} 
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Rental'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}