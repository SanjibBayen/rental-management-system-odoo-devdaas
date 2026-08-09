<<<<<<< HEAD
import React, { useState, useCallback, useMemo } from 'react';
import { Package, Clock, DollarSign, AlertCircle, RefreshCw, Search, X, CheckCircle, ArrowRight } from 'lucide-react';
import Modal from '../../components/Modal';
import { useDashboard } from '../../hooks/useDashboard';
import { useRentals } from '../../hooks/useRentals';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ customerEmail: '', productName: '', startDate: '', endDate: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [productResults, setProductResults] = useState<any[]>([]);

  const {
    stats,
    isLoading,
    refetch: refetchStats,
    activeRentalsPercentage,
    overdueRate,
  } = useDashboard();
  const { rentals, refetch: refetchRentals } = useRentals({ view: 'recent', limit: 10 });
  const { user } = useAuth();

  // Search customers by email
  const searchCustomers = useCallback(async (email: string) => {
    if (email.length < 3) return setCustomerResults([]);
    try {
      const { data } = await api.get('/users/search', { params: { email, role: 'customer' } });
      setCustomerResults(data.data || []);
    } catch { setCustomerResults([]); }
  }, []);
=======
import React, { useState } from "react";
import { Users, Package, Clock, DollarSign, ArrowRight } from "lucide-react";
import Modal from "../../components/Modal";
import { useDashboard } from "../../hooks/useDashboard";
import { useRentals } from "../../hooks/useRentals";
import { formatCurrency } from "../../utils/formatters";
import { formatDate } from "../../utils/dateHelpers";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../utils/api";

export default function AdminDashboard() {
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);
  const {
    stats,
    isLoading: dashboardLoading,
    refetch: refetchStats,
  } = useDashboard();
  const {
    rentals,
    isLoading: rentalsLoading,
    refetch: refetchRentals,
  } = useRentals({ view: "recent", limit: 5 });
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    customerSearch: "",
    productSearch: "",
    startDate: "",
    endDate: "",
  });
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d

  // Search products by name
  const searchProducts = useCallback(async (name: string) => {
    if (name.length < 2) return setProductResults([]);
    try {
      const { data } = await api.get('/products/search', { params: { search: name, available: true } });
      setProductResults(data.data || []);
    } catch { setProductResults([]); }
  }, []);

  // Calculate rental cost
  const rentalCost = useMemo(() => {
    if (!selectedProduct || !form.startDate || !form.endDate) return null;
    const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return null;
    return { days, total: days * selectedProduct.pricePerDay, deposit: selectedProduct.depositAmount || selectedProduct.pricePerDay * 2 };
  }, [selectedProduct, form.startDate, form.endDate]);

  // Validate form
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCustomer) errs.customerEmail = 'Select a customer';
    if (!selectedProduct) errs.productId = 'Select a product';
    if (!form.startDate) errs.startDate = 'Required';
    if (!form.endDate) errs.endDate = 'Required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) errs.endDate = 'Must be after start date';
    if (selectedProduct && !selectedProduct.available) errs.productId = 'Product unavailable';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Create rental
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedCustomer || !selectedProduct || !rentalCost) return;
    setIsCreating(true);
    try {
<<<<<<< HEAD
      await api.post('/rentals/create', {
        user_id: selectedCustomer.id,
        product_id: selectedProduct.id,
        start_date: form.startDate,
        end_date: form.endDate,
        total_amount: rentalCost.total,
        deposit_amount: rentalCost.deposit,
=======
      // Step 1: Search for customer by email (you need a customer search endpoint)
      // For now, we assume the user enters a valid email
      const customerEmail = formData.customerSearch.trim();

      // Step 2: Search for product by name (you need a product search endpoint)
      const productResponse = await api.products.getAll({
        search: formData.productSearch,
      });
      const product = productResponse.data?.[0];
      if (!product) {
        alert("Product not found. Please enter a valid product name.");
        setIsCreating(false);
        return;
      }

      // Step 3: Get customer ID (you'd need a customer lookup endpoint)
      // For demo, we'll use a mock customer ID - replace with actual API call
      const customerId = "22222222-2222-2222-2222-222222222222"; // Replace with real customer lookup

      // Step 4: Calculate total amount and deposit
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
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
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
      });
      await Promise.all([refetchRentals(), refetchStats()]);
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || 'Failed to create rental' });
    } finally { setIsCreating(false); }
  };

<<<<<<< HEAD
  const resetForm = () => {
    setForm({ customerEmail: '', productName: '', startDate: '', endDate: '' });
    setErrors({});
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setCustomerResults([]);
    setProductResults([]);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700', returned: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-gray-100 text-gray-500',
    };
    return `px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`;
  };

  if (isLoading) return (
    <main className="flex-1 flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </main>
  );
=======
      // Step 6: Refresh data
      await refetchRentals();
      await refetchStats();
      setIsNewRentalModalOpen(false);
      setFormData({
        customerSearch: "",
        productSearch: "",
        startDate: "",
        endDate: "",
      });
      alert("Rental created successfully!");
    } catch (error: any) {
      alert("Failed to create rental: " + (error.message || "Unknown error"));
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-success-teal/10 text-success-teal",
      pending: "bg-warning-amber/10 text-warning-amber",
      overdue: "bg-danger-red/10 text-danger-red",
      returned: "bg-primary/10 text-primary",
      cancelled: "bg-surface-dim/50 text-outline",
    };
    return colors[status] || "bg-surface-muted text-on-surface";
  };

  if (dashboardLoading || rentalsLoading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">
            Loading dashboard...
          </div>
        </div>
      </main>
    );
  }
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome, {user?.name || 'Admin'}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-dark active:scale-95 transition-all">
=======
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>
        <button
          onClick={() => setIsNewRentalModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm active:scale-95"
        >
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
          + New Rental
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<<<<<<< HEAD
        {[
          { label: 'Active Rentals', value: stats?.activeRentals || 0, icon: Package, color: 'bg-primary/10 text-primary', change: `${activeRentalsPercentage || 0}% of inventory` },
          { label: 'Overdue', value: stats?.overdueRentals || 0, icon: AlertCircle, color: 'bg-red-100 text-red-600', change: `${overdueRate || 0}% overdue rate` },
          { label: 'Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-100 text-green-600', change: stats?.revenueGrowth ? `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%` : '' },
          { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-100 text-blue-600', change: 'Total inventory' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 font-medium text-sm uppercase">{stat.label}</h3>
              <div className={`p-2.5 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
=======
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">
              Active Rentals
            </h3>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            {stat.change && <div className="text-sm text-gray-500 mt-2">{stat.change}</div>}
          </div>
<<<<<<< HEAD
        ))}
=======
          <div className="text-3xl font-bold text-on-surface">
            {stats?.activeRentals || 0}
          </div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+12%</span> from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">
              Due Today
            </h3>
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
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">
              Revenue
            </h3>
            <div className="p-2.5 bg-success-teal/10 rounded-lg text-success-teal group-hover:bg-success-teal group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+8%</span> from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">
              Products
            </h3>
            <div className="p-2.5 bg-info-blue/10 rounded-lg text-info-blue group-hover:bg-info-blue group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {stats?.totalProducts || 0}
          </div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+4</span> new this week
          </div>
        </div>
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
      </div>

      {/* Recent Rentals Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-lg">Recent Rentals</h2>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">View All <ArrowRight className="w-4 h-4" /></button>
        </div>
<<<<<<< HEAD
=======

>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
<<<<<<< HEAD
              <tr className="border-b">
                {['Status', 'Order ID', 'Customer', 'Product', 'Return Date', 'Amount'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!rentals?.length ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No recent rentals</td></tr>
              ) : rentals.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><span className={getStatusBadge(r.status)}>{r.status}</span></td>
                  <td className="px-6 py-4 font-mono text-sm">#{r.rentalNumber}</td>
                  <td className="px-6 py-4 font-medium">{r.customerName || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{r.productName}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(r.endDate)}</td>
                  <td className="px-6 py-4 font-bold">{formatCurrency(r.totalAmount)}</td>
                </tr>
              ))}
=======
              <tr className="border-b border-border-standard">
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">
                  Order ID
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline">
                  Return Date
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-outline text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {rentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-on-surface-variant"
                  >
                    No recent rentals found
                  </td>
                </tr>
              ) : (
                rentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b border-border-standard hover:bg-surface-muted transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(rental.status)}`}
                      >
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface">
                      #{rental.rental_number}
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      {rental.customer_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-outline font-medium">
                      {formatDate(rental.end_date || "")}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-on-surface">
                      {formatCurrency(rental.total_amount ?? 0)}
                    </td>
                  </tr>
                ))
              )}
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
            </tbody>
          </table>
        </div>
      </div>

<<<<<<< HEAD
      {/* Create Rental Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { if (!isCreating) { setIsModalOpen(false); resetForm(); } }} title="Create New Rental" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {errors.general && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{errors.general}</div>}

          {/* Customer Search */}
          <div>
            <label className="block text-sm font-bold mb-1">Customer Email *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="email" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary ${errors.customerEmail ? 'border-red-500' : ''}`}
                placeholder="Search customer..." value={form.customerEmail}
                onChange={e => { setForm(f => ({ ...f, customerEmail: e.target.value })); searchCustomers(e.target.value); setSelectedCustomer(null); }} />
            </div>
            {customerResults.length > 0 && !selectedCustomer && (
              <div className="mt-1 border rounded-lg overflow-hidden">
                {customerResults.map(c => (
                  <button key={c.id} type="button" onClick={() => { setSelectedCustomer(c); setForm(f => ({ ...f, customerEmail: c.email })); setCustomerResults([]); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 border-b last:border-0">
                    <p className="font-medium">{c.name}</p><p className="text-sm text-gray-500">{c.email}</p>
                  </button>
                ))}
              </div>
            )}
            {selectedCustomer && <div className="mt-1 p-3 bg-primary/5 rounded-lg flex justify-between"><div><p className="font-medium">{selectedCustomer.name}</p><p className="text-sm text-gray-500">{selectedCustomer.email}</p></div><button type="button" onClick={() => { setSelectedCustomer(null); setForm(f => ({ ...f, customerEmail: '' })); }}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button></div>}
=======
      {/* New Rental Modal - Now creates real rental via API */}
      <Modal
        isOpen={isNewRentalModalOpen}
        onClose={() => setIsNewRentalModalOpen(false)}
        title="Create New Rental"
      >
        <form onSubmit={handleCreateRental} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              Customer Email
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="customer@example.com"
              value={formData.customerSearch}
              onChange={(e) =>
                setFormData({ ...formData, customerSearch: e.target.value })
              }
            />
            <p className="text-xs text-outline mt-1">
              Enter the customer's email address
            </p>
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
          </div>

          {/* Product Search */}
          <div>
<<<<<<< HEAD
            <label className="block text-sm font-bold mb-1">Product *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required type="text" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary ${errors.productId ? 'border-red-500' : ''}`}
                placeholder="Search product..." value={form.productName}
                onChange={e => { setForm(f => ({ ...f, productName: e.target.value })); searchProducts(e.target.value); setSelectedProduct(null); }} />
            </div>
            {productResults.length > 0 && !selectedProduct && (
              <div className="mt-1 border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                {productResults.map(p => (
                  <button key={p.id} type="button" onClick={() => { setSelectedProduct(p); setForm(f => ({ ...f, productName: p.name })); setProductResults([]); }}
                    disabled={!p.available} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 border-b last:border-0 disabled:opacity-50">
                    <div className="flex justify-between"><div><p className="font-medium">{p.name}</p><p className="text-sm text-gray-500">{formatCurrency(p.pricePerDay)}/day</p></div>{!p.available && <span className="text-xs text-red-500">Unavailable</span>}</div>
                  </button>
                ))}
              </div>
            )}
            {selectedProduct && <div className="mt-1 p-3 bg-primary/5 rounded-lg flex justify-between"><div><p className="font-medium">{selectedProduct.name}</p><p className="text-sm text-gray-500">{formatCurrency(selectedProduct.pricePerDay)}/day</p></div><button type="button" onClick={() => { setSelectedProduct(null); setForm(f => ({ ...f, productName: '' })); }}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button></div>}
=======
            <label className="block text-sm font-bold text-on-surface mb-1">
              Product Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Search product..."
              value={formData.productSearch}
              onChange={(e) =>
                setFormData({ ...formData, productSearch: e.target.value })
              }
            />
            <p className="text-xs text-outline mt-1">
              Enter the product name exactly as listed
            </p>
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
            <div><label className="block text-sm font-bold mb-1">Start Date *</label><input required type="date" className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary ${errors.startDate ? 'border-red-500' : ''}`} min={new Date().toISOString().split('T')[0]} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div><label className="block text-sm font-bold mb-1">End Date *</label><input required type="date" className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary ${errors.endDate ? 'border-red-500' : ''}`} min={form.startDate || new Date().toISOString().split('T')[0]} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
          </div>

          {/* Cost Summary */}
          {rentalCost && <div className="p-4 bg-gray-50 rounded-lg space-y-2"><div className="flex justify-between text-sm"><span>Duration</span><span className="font-medium">{rentalCost.days} days</span></div><div className="flex justify-between text-sm"><span>Total</span><span className="font-bold text-primary">{formatCurrency(rentalCost.total)}</span></div><div className="flex justify-between text-sm pt-2 border-t"><span>Deposit</span><span className="font-bold text-yellow-600">{formatCurrency(rentalCost.deposit)}</span></div></div>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg" disabled={isCreating}>Cancel</button>
            <button type="submit" disabled={isCreating || !selectedCustomer || !selectedProduct} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
              {isCreating ? 'Creating...' : 'Create Rental'}
=======
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Start Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                End Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
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
              {isCreating ? "Creating..." : "Create Rental"}
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
