import React, { useState } from 'react';
import { Users, Package, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminDashboard() {
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewRentalModalOpen(false);
    alert('New rental created successfully! (Simulation)');
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Admin Dashboard</h1>
        <button 
          onClick={() => setIsNewRentalModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm active:scale-95"
        >
          + New Rental
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Active Rentals</h3>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">84</div>
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
          <div className="text-3xl font-bold text-on-surface">₹14.2K</div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+8%</span> from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">Customers</h3>
            <div className="p-2.5 bg-info-blue/10 rounded-lg text-info-blue group-hover:bg-info-blue group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface">1,204</div>
          <div className="text-success-teal text-sm font-medium mt-2 flex items-center gap-1">
            <span className="font-bold">+4</span> new this week
          </div>
        </div>
      </div>

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
              <tr className="border-b border-border-standard hover:bg-surface-muted transition-colors">
                <td className="px-6 py-4"><span className="px-2 py-1 bg-success-teal/10 text-success-teal rounded text-xs font-bold">Active</span></td>
                <td className="px-6 py-4 font-mono text-sm text-on-surface">#ORD-90210</td>
                <td className="px-6 py-4 font-bold text-on-surface">Sarah Jenkins</td>
                <td className="px-6 py-4 text-outline font-medium">Oct 25, 2023</td>
                <td className="px-6 py-4 text-right font-bold text-on-surface">₹120.00</td>
              </tr>
              <tr className="border-b border-border-standard hover:bg-surface-muted transition-colors">
                <td className="px-6 py-4"><span className="px-2 py-1 bg-warning-amber/10 text-warning-amber rounded text-xs font-bold">Pending</span></td>
                <td className="px-6 py-4 font-mono text-sm text-on-surface">#ORD-55231</td>
                <td className="px-6 py-4 font-bold text-on-surface">BuildCorp Ltd.</td>
                <td className="px-6 py-4 text-outline font-medium">Oct 28, 2023</td>
                <td className="px-6 py-4 text-right font-bold text-on-surface">₹450.00</td>
              </tr>
              <tr className="border-b border-border-standard hover:bg-surface-muted transition-colors">
                <td className="px-6 py-4"><span className="px-2 py-1 bg-danger-red/10 text-danger-red rounded text-xs font-bold">Overdue</span></td>
                <td className="px-6 py-4 font-mono text-sm text-on-surface">#ORD-11004</td>
                <td className="px-6 py-4 font-bold text-on-surface">Vision Studios</td>
                <td className="px-6 py-4 text-danger-red font-bold">Oct 22, 2023</td>
                <td className="px-6 py-4 text-right font-bold text-on-surface">₹85.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isNewRentalModalOpen} onClose={() => setIsNewRentalModalOpen(false)} title="Create New Rental">
        <form onSubmit={handleCreateRental} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Customer Search</label>
            <input required type="text" className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Search by name or email..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Equipment Name</label>
            <input required type="text" className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Search equipment..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">Start Date</label>
              <input required type="date" className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">End Date</label>
              <input required type="date" className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
          </div>
          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button type="button" onClick={() => setIsNewRentalModalOpen(false)} className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity">Create Rental</button>
          </div>
        </form>
      </Modal>

    </main>
  );
}
