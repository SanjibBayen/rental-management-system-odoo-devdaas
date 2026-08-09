import { ShoppingCart, Search, Menu, UserCircle, LogOut, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const DesktopNavItem = ({ 
  viewId, 
  label, 
  isActive, 
  onClick 
}: { 
  viewId: string; 
  label: string; 
  isActive: boolean;
  onClick: (viewId: string) => void;
}) => (
  <button 
    onClick={() => onClick(viewId)}
    className={`px-1 py-4 text-sm font-semibold transition-colors border-b-2 ${
      isActive 
        ? 'text-primary border-primary' 
        : 'text-on-surface-variant border-transparent hover:text-on-surface'
    }`}
  >
    {label}
  </button>
);

const MobileNavItem = ({ 
  viewId, 
  label, 
  isActive, 
  onClick 
}: { 
  viewId: string; 
  label: string; 
  isActive: boolean;
  onClick: (viewId: string) => void;
}) => (
  <button 
    onClick={() => onClick(viewId)}
    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
        : 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface border-l-4 border-transparent'
    }`}
  >
    {label}
  </button>
);

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const role = user?.role || 'customer';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = useMemo(() => {
    switch (role) {
      case 'customer':
        return [
          { viewId: 'home', label: 'Home' },
          { viewId: 'catalog', label: 'Catalog' },
          { viewId: 'rentals', label: 'My Rentals' },
        ];
      case 'admin':
        return [
          { viewId: 'dashboard', label: 'Dashboard' },
          { viewId: 'inventory', label: 'Inventory' },
          { viewId: 'customers', label: 'Customers' },
          { viewId: 'analytics', label: 'Analytics' },
        ];
      case 'delivery':
        return [
          { viewId: 'tasks', label: 'Tasks' },
          { viewId: 'route', label: 'Route' },
        ];
      default:
        return [];
    }
  }, [role]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback((viewId: string) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  }, [setActiveView]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('catalog');
    }
  }, [searchQuery, setActiveView]);

  const handleLogout = useCallback(() => {
    setIsMobileMenuOpen(false);
    logout();
  }, [logout]);

  return (
    <header className="bg-white border-b border-border-standard sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-margin-desktop">
        <button 
          onClick={() => {
            const defaultView = role === 'customer' ? 'home' : (role === 'admin' ? 'dashboard' : 'tasks');
            handleNavClick(defaultView);
          }}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity py-4"
        >
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-lg font-black shadow-sm">R</div>
          RentFlow
        </button>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <DesktopNavItem
              key={item.viewId}
              viewId={item.viewId}
              label={item.label}
              isActive={activeView === item.viewId}
              onClick={handleNavClick}
            />
          ))}
        </nav>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {role === 'customer' && (
            <>
              <form onSubmit={handleSearch} className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-2 bg-surface-muted border border-border-standard rounded-lg font-medium text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" 
                  placeholder="Search rentals..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              <button 
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
          
          <div className="flex items-center gap-3 md:border-l md:border-border-standard md:pl-6">
            <button 
              className="flex items-center gap-2 group"
              onClick={() => handleNavClick('profile')}
            >
              <UserCircle className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
              {user && (
                <div className="hidden sm:block text-xs text-left">
                  <p className="font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <p className="text-outline leading-tight capitalize">{user.role}</p>
                </div>
              )}
            </button>
            
            {user && (
              <button 
                onClick={handleLogout} 
                className="text-on-surface-variant hover:text-danger-red transition-colors hidden sm:block"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button 
            className="md:hidden text-on-surface hover:text-primary transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`md:hidden fixed top-[64px] left-0 w-full bg-white border-b border-border-standard shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col max-h-[calc(100vh-64px)] overflow-y-auto">
          {role === 'customer' && (
            <div className="px-4 py-3 border-b border-border-standard">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-muted border border-border-standard rounded-lg font-medium text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="Search rentals..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          )}

          {navItems.map((item) => (
            <MobileNavItem
              key={item.viewId}
              viewId={item.viewId}
              label={item.label}
              isActive={activeView === item.viewId}
              onClick={handleNavClick}
            />
          ))}
          
          <div className="border-t border-border-standard mt-2 pt-2 pb-4">
            <MobileNavItem
              viewId="profile"
              label="My Profile"
              isActive={activeView === 'profile'}
              onClick={handleNavClick}
            />
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold text-danger-red hover:bg-danger-red/10 border-l-4 border-transparent transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}