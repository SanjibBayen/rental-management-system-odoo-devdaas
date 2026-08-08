import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

export type Role = "admin" | "customer" | "delivery";

export type Permission =
  | "manage_users"
  | "manage_inventory"
  | "view_all_rentals"
  | "manage_own_rentals"
  | "view_assigned_deliveries"
  | "update_delivery_status";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

// Map backend role to frontend permissions
const getPermissionsForRole = (role: Role): Permission[] => {
  switch (role) {
    case "admin":
      return [
        "manage_users",
        "manage_inventory",
        "view_all_rentals",
        "update_delivery_status",
      ];
    case "delivery":
      return ["view_assigned_deliveries", "update_delivery_status"];
    case "customer":
    default:
      return ["manage_own_rentals"];
  }
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<{
    userId: any;
    userEmail: string;
    requiresEmailVerification: boolean;
  }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const { token, user: backendUser } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Map backend user to frontend User
      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.full_name,
        email: backendUser.email,
        role: backendUser.role as Role,
        permissions: getPermissionsForRole(backendUser.role as Role),
      };

      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // ============================================================
  // SIGNUP / REGISTER
  // ============================================================
  const signup = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => {
    try {
      const response = await api.post("/auth/register", {
        full_name: name,
        email,
        password,
        phone: phone || "",
      });

      const {
        userId,
        email: userEmail,
        requiresEmailVerification,
      } = response.data;

      // Return success data; frontend can redirect to OTP page
      return { userId, userEmail, requiresEmailVerification };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ============================================================
  // PERMISSION CHECK
  // ============================================================
  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
