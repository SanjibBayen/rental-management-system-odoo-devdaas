import { Users, Package, Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-on-surface">Admin Dashboard</h1>
        <button 
          onClick={() => alert("Redirecting to New Rental Draft...")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-opacity shadow-sm"
        >
          + New Rental
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-outline font-semibold text-sm">Active Rentals</h3>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-on-surface">84</div>
          <div className="text-success-teal text-sm font-semibold mt-2">+12% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-outline font-semibold text-sm">Due Today</h3>
            <div className="p-2 bg-warning-amber/10 rounded-lg text-warning-amber">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-on-surface">7</div>
          <div className="text-danger-red text-sm font-semibold mt-2">2 Overdue</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-outline font-semibold text-sm">Revenue</h3>
            <div className="p-2 bg-success-teal/10 rounded-lg text-success-teal">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-on-surface">₹14.2K</div>
          <div className="text-success-teal text-sm font-semibold mt-2">+8% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-outline font-semibold text-sm">Customers</h3>
            <div className="p-2 bg-info-blue/10 rounded-lg text-info-blue">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-on-surface">1,204</div>
          <div className="text-success-teal text-sm font-semibold mt-2">+24 new this week</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-standard shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-standard flex justify-between items-center bg-surface-muted">
          <h2 className="font-bold text-lg text-on-surface">Recent Rentals</h2>
          <button onClick={() => alert("Viewing all rentals...")} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
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
    </main>
  );
}
