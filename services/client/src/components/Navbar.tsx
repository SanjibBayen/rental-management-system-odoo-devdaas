import { ShoppingCart, Search, Menu, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || 'customer';

  const NavItem = ({ viewId, label }: { viewId: string, label: string }) => (
    <button 
      onClick={() => setActiveView(viewId)}
      className={`${activeView === viewId ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors pb-1 border-b-2 border-transparent'}`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white border-b border-border-standard sticky z-50 top-0 shadow-sm">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-margin-desktop py-3">
        {/* Brand */}
        <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-primary cursor-pointer hover:opacity-90 transition-opacity">
          {/* <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-lg font-bold"></div> */}
          RentFlow
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {role === 'customer' && (
            <>
              <NavItem viewId="catalog" label="Catalog" />
              <NavItem viewId="rentals" label="My Rentals" />
            </>
          )}
          {role === 'admin' && (
            <>
              <NavItem viewId="dashboard" label="Dashboard" />
              <NavItem viewId="inventory" label="Inventory" />
              <NavItem viewId="customers" label="Customers" />
            </>
          )}
          {role === 'delivery' && (
            <>
              <NavItem viewId="tasks" label="Tasks" />
              <NavItem viewId="route" label="Route" />
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
                <div className="hidden sm:block text-xs text-left">
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
