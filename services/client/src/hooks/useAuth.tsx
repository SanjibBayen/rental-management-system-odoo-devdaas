import React, { createContext, useContext, useState } from 'react';

export type Role = 'admin' | 'customer' | 'delivery';

export type Permission = 
  | 'manage_users'
  | 'manage_inventory'
  | 'view_all_rentals'
  | 'manage_own_rentals'
  | 'view_assigned_deliveries'
  | 'update_delivery_status';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@rentflow.com',
    role: 'admin',
    permissions: ['manage_users', 'manage_inventory', 'view_all_rentals', 'update_delivery_status'],
  },
  {
    id: 'u2',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    permissions: ['manage_own_rentals'],
  },
  {
    id: 'u3',
    name: 'Dave Delivery',
    email: 'dave@rentflow.com',
    role: 'delivery',
    permissions: ['view_assigned_deliveries', 'update_delivery_status'],
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Default fallback for any other email as a customer
      setUser({
        id: 'u_new_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: 'customer',
        permissions: ['manage_own_rentals']
      });
    }
  };

  const signup = (name: string, email: string) => {
    setUser({
      id: 'u_new_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: 'customer',
      permissions: ['manage_own_rentals']
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
