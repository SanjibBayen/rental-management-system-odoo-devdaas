import { useAuth } from '../../hooks/useAuth';
import { Building2, User, Truck, Briefcase } from 'lucide-react';

export default function Login() {
  const { login, mockUsers } = useAuth();

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-border-standard">
        {/* Left side branding */}
        <div className="bg-primary p-12 text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center text-2xl font-black">R</div>
            <h1 className="text-4xl font-black tracking-tight">RentFlow</h1>
          </div>
          <p className="text-primary-container text-lg font-medium leading-relaxed">
            Enterprise rental management system. Streamline your inventory, customers, and deliveries in one unified platform.
          </p>
          <div className="mt-12 flex items-center gap-3 text-sm text-primary-container font-medium">
            <Briefcase className="w-5 h-5" />
            Powered by Odoo Infrastructure
          </div>
        </div>
        
        {/* Right side login */}
        <div className="p-12 flex flex-col justify-center bg-surface-bright">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h2>
          <p className="text-on-surface-variant font-medium mb-8">Please select your portal to continue.</p>
          
          <div className="space-y-4">
            {mockUsers.map(u => (
              <button 
                key={u.id}
                onClick={() => login(u.id)}
                className="w-full flex items-center p-4 border border-border-standard rounded-xl hover:border-primary hover:bg-primary/5 transition-all group text-left shadow-sm hover:shadow-md bg-white"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-muted group-hover:bg-primary/10 flex items-center justify-center text-primary mr-4 transition-colors">
                  {u.role === 'admin' ? <Building2 className="w-6 h-6" /> : u.role === 'delivery' ? <Truck className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div>
                  <div className="font-bold text-on-surface text-lg">{u.name}</div>
                  <div className="text-outline text-sm font-medium capitalize">{u.role} Portal</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );  
}
