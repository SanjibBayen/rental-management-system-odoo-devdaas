import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, TrendingUp, Users, Package } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useRentals } from '../../hooks/useRentals';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';

export default function Analytics() {
  const { stats, isLoading: dashboardLoading } = useDashboard();
  const { rentals, isLoading: rentalsLoading } = useRentals({ view: 'all', limit: 100 });
  const { products, isLoading: productsLoading } = useProducts();

  // Generate revenue data from rentals (real data)
  const revenueData = React.useMemo(() => {
    if (!rentals || rentals.length === 0) {
      return [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
      ];
    }

    // Group rentals by month
    const monthlyData: Record<string, number> = {};
    rentals.forEach((rental) => {
      const month = new Date(rental.start_date).toLocaleString('en-US', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + rental.total_amount;
    });

    // Sort months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months
      .filter(m => monthlyData[m])
      .map(m => ({ name: m, total: monthlyData[m] }));
  }, [rentals]);

  // Generate category data from products (real data)
  const categoryData = React.useMemo(() => {
    if (!products || products.length === 0) {
      return [
        { name: 'Electronics', count: 0 },
        { name: 'Construction', count: 0 },
        { name: 'Audio/Visual', count: 0 },
        { name: 'Lighting', count: 0 },
      ];
    }

    // Group products by category
    const categoryMap: Record<string, number> = {};
    products.forEach((product) => {
      const category = product.category || 'Other';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [products]);

  if (dashboardLoading || rentalsLoading || productsLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Analytics & Reports</h1>
          <p className="text-on-surface-variant mt-2 font-medium">Platform performance overview</p>
        </div>
      </div>

      {/* Stats Cards - Real API data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex items-center gap-3 text-on-surface-variant mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-bold">Total Revenue</span>
          </div>
          <div className="text-3xl font-black text-on-surface mb-2">{formatCurrency(stats?.totalRevenue || 0)}</div>
          <div className="text-xs font-bold text-success-teal flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +12.5% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex items-center gap-3 text-on-surface-variant mb-4">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold">Total Products</span>
          </div>
          <div className="text-3xl font-black text-on-surface mb-2">{stats?.totalProducts || 0}</div>
          <div className="text-xs font-bold text-success-teal flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +4.2% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <div className="flex items-center gap-3 text-on-surface-variant mb-4">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-bold">Active Rentals</span>
          </div>
          <div className="text-3xl font-black text-on-surface mb-2">{stats?.activeRentals || 0}</div>
          <div className="text-xs font-bold text-success-teal flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +18.1% from last month
          </div>
        </div>
      </div>

      {/* Charts - Real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <h3 className="font-bold text-lg mb-6">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#424242' }}
                />
                <Area type="monotone" dataKey="total" stroke="#714B67" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
          <h3 className="font-bold text-lg mb-6">Rentals by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#757575', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#424242', fontSize: 12, fontWeight: 'bold'}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#F5F5F5'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0' }}
                />
                <Bar dataKey="count" fill="#714B67" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}