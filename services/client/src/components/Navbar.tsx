import { ShoppingCart, Search, Menu, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, login, logout, mockUsers } = useAuth();
  const role = user?.role || 'customer';

  return (
    <header className="bg-white border-b border-border-standard sticky z-50 top-0 shadow-sm">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-margin-desktop py-3">
        {/* Brand */}
        <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-primary cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-lg font-bold">R</div>
          RentFlow
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {role === 'customer' && (
            <>
              <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Catalog</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">My Rentals</a>
            </>
          )}
          {role === 'admin' && (
            <>
              <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Dashboard</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Inventory</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Customers</a>
            </>
          )}
          {role === 'delivery' && (
            <>
              <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Tasks</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Route</a>
            </>
          )}
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-6">
          {role === 'customer' && (
            <>
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-2 bg-surface-muted border border-border-standard rounded-lg font-medium text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" 
                  placeholder="Search rentals..." 
                  type="text"
                />
              </div>
              
              <button aria-label="Cart" className="relative text-on-surface-variant hover:text-primary transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  3
                </span>
              </button>
            </>
          )}
          
          <div className="flex items-center gap-3 border-l border-border-standard pl-6">
            <div className="flex items-center gap-2">
              <UserCircle className="w-8 h-8 text-on-surface-variant" />
              {user && (
                <div className="hidden sm:block text-xs">
                  <p className="font-bold text-on-surface leading-tight">{user.name}</p>
                  <p className="text-outline leading-tight capitalize">{user.role}</p>
                </div>
              )}
            </div>
            {user && (
              <button onClick={logout} className="text-on-surface-variant hover:text-danger-red ml-2 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button className="md:hidden text-on-surface hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
