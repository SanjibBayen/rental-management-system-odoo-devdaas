import { ShoppingCart, Search, Menu, UserCircle, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const role = user?.role || 'customer';
  const [showNotifications, setShowNotifications] = useState(false);

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
        <div 
          onClick={() => setActiveView(role === 'customer' ? 'home' : (role === 'admin' ? 'dashboard' : 'tasks'))}
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-primary cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-lg font-bold">R</div>
          RentFlow
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {role === 'customer' && (
            <>
              <NavItem viewId="home" label="Home" />
              <NavItem viewId="catalog" label="Catalog" />
              <NavItem viewId="rentals" label="My Rentals" />
            </>
          )}
          {role === 'admin' && (
            <>
              <NavItem viewId="dashboard" label="Dashboard" />
              <NavItem viewId="inventory" label="Inventory" />
              <NavItem viewId="customers" label="Customers" />
              <NavItem viewId="analytics" label="Analytics" />
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
              
              <button 
                aria-label="Cart" 
                onClick={() => setActiveView('cart')}
                className="relative text-on-surface-variant hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}
          
          <div className="flex items-center gap-3 border-l border-border-standard pl-6">
            
            {/* Notifications */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-on-surface-variant hover:text-primary transition-colors relative mr-2"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-danger-red text-white text-[8px] font-bold px-1 rounded-full">2</span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-border-standard rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border-standard font-bold text-sm bg-surface-muted">
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 border-b border-border-standard hover:bg-surface-muted cursor-pointer transition-colors">
                        <div className="text-xs font-bold text-primary mb-1">New Order</div>
                        <div className="text-xs text-on-surface">Order #2039 needs review and dispatch.</div>
                        <div className="text-[10px] text-outline mt-1">2 mins ago</div>
                      </div>
                      <div className="p-3 hover:bg-surface-muted cursor-pointer transition-colors">
                        <div className="text-xs font-bold text-success-teal mb-1">Delivery Completed</div>
                        <div className="text-xs text-on-surface">Driver John finished route.</div>
                        <div className="text-[10px] text-outline mt-1">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setActiveView('profile')}
            >
              <UserCircle className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
              {user && (
                <div className="hidden sm:block text-xs text-left">
                  <p className="font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-outline leading-tight capitalize">{user.role}</p>
                </div>
              )}
            </div>
            {user && (
              <button onClick={(e) => { e.stopPropagation(); logout(); }} className="text-on-surface-variant hover:text-danger-red ml-2 transition-colors" title="Logout">
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
 