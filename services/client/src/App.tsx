import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

// Customer
import Home from './pages/customer/Home';
import CustomerCatalog from './pages/customer/CustomerCatalog';
import ProductDetail from './pages/customer/ProductDetail';
import MyRentals from './pages/customer/MyRentals';
import Cart from './pages/customer/Cart';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import Inventory from './pages/admin/Inventory';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';

// Delivery
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import Route from './pages/delivery/Route';

// Shared Public
import Login from './pages/public/Login';
import Profile from './pages/public/Profile';

import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') setActiveView('home');
      else if (user.role === 'admin') setActiveView('dashboard');
      else if (user.role === 'delivery') setActiveView('tasks');
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  const role = user.role;

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col w-full">
        {/* Customer Views */}
        {role === 'customer' && activeView === 'home' && <Home setActiveView={setActiveView} setSelectedProductId={setSelectedProductId} />}
        {role === 'customer' && activeView === 'catalog' && <CustomerCatalog setActiveView={setActiveView} setSelectedProductId={setSelectedProductId} />}
        {role === 'customer' && activeView === 'product_detail' && <ProductDetail productId={selectedProductId} setActiveView={setActiveView} />}
        {role === 'customer' && activeView === 'rentals' && <MyRentals />}
        {role === 'customer' && activeView === 'cart' && <Cart setActiveView={setActiveView} />}
        
        {/* Admin Views */}
        {role === 'admin' && activeView === 'dashboard' && <AdminDashboard />}
        {role === 'admin' && activeView === 'inventory' && <Inventory />}
        {role === 'admin' && activeView === 'customers' && <Customers />}
        {role === 'admin' && activeView === 'analytics' && <Analytics />}
        
        {/* Delivery Views */}
        {role === 'delivery' && activeView === 'tasks' && <DeliveryDashboard />}
        {role === 'delivery' && activeView === 'route' && <Route />}
        
        {/* Shared Views */}
        {activeView === 'profile' && <Profile />}
      </div>
    </div>
  );
}
  