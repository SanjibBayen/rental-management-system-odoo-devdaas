import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerCatalog from './pages/customer/CustomerCatalog';
import MyRentals from './pages/customer/MyRentals';
import AdminDashboard from './pages/admin/AdminDashboard';
import Inventory from './pages/admin/Inventory';
import Customers from './pages/admin/Customers';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import Route from './pages/delivery/Route';
import Login from './pages/public/Login';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') setActiveView('catalog');
      else if (user.role === 'admin') setActiveView('dashboard');
      else if (user.role === 'delivery') setActiveView('tasks');
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  const role = user.role;

  return (
    <>
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      {role === 'customer' && activeView === 'catalog' && <CustomerCatalog />}
      {role === 'customer' && activeView === 'rentals' && <MyRentals />}
      
      {role === 'admin' && activeView === 'dashboard' && <AdminDashboard />}
      {role === 'admin' && activeView === 'inventory' && <Inventory />}
      {role === 'admin' && activeView === 'customers' && <Customers />}
      
      {role === 'delivery' && activeView === 'tasks' && <DeliveryDashboard />}
      {role === 'delivery' && activeView === 'route' && <Route />}
    </>
  );
}
