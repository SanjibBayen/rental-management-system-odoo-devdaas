import Navbar from './components/Navbar';
import CustomerCatalog from './pages/customer/CustomerCatalog';
import AdminDashboard from './pages/admin/AdminDashboard';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import Login from './pages/public/Login';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();
  
  if (!user) {
    return <Login />;
  }

  const role = user.role;

  return (
    <>
      <Navbar />
      
      {role === 'customer' && <CustomerCatalog />}
      {role === 'admin' && <AdminDashboard />}
      {role === 'delivery' && <DeliveryDashboard />}
    </>
  );
}
 