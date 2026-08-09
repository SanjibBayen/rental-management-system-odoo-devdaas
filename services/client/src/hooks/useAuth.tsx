import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: Role,
    phone?: string,
  ) => Promise<{
    userId: string;
    userEmail: string;
    requiresEmailVerification: boolean;
  }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  verifyOTP: (userId: string, otp: string) => Promise<any>;
  resendOTP: (userId: string, email: string) => Promise<any>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setError("Session expired. Please login again.");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: backendUser } = response.data;

      if (!token || !backendUser) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);

      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.full_name || backendUser.name || email.split("@")[0],
        email: backendUser.email || email,
        role: (backendUser.role as Role) || "customer",
        permissions: getPermissionsForRole(
          (backendUser.role as Role) || "customer",
        ),
      };

      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      setError(message);
      const authError = new Error(message) as Error & { response?: any };
      authError.response = error.response;
      throw authError;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: Role = "customer",
    phone?: string,
  ) => {
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        full_name: name,
        email,
        password,
        role,  // ✅ Send role to backend
        phone: phone || "",
      });

      const { userId, email: userEmail, requiresEmailVerification } = response.data;

      if (!userId) {
        throw new Error("Invalid response from server");
      }

      return {
        userId,
        userEmail: userEmail || email,
        requiresEmailVerification: requiresEmailVerification !== false,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      setError(message);
      throw new Error(message);
    }
  };

  const verifyOTP = async (userId: string, otp: string) => {
    setError(null);
    try {
      const response = await api.post("/auth/verify-otp", { userId, otp });

      if (response.data?.token && response.data?.user) {
        const { token, user: backendUser } = response.data;
        localStorage.setItem("token", token);
        const mappedUser: User = {
          id: backendUser.id,
          name: backendUser.full_name || backendUser.name || "User",
          email: backendUser.email || "",
          role: (backendUser.role as Role) || "customer",
          permissions: getPermissionsForRole(
            (backendUser.role as Role) || "customer",
          ),
        };
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setUser(mappedUser);
      }
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "OTP verification failed";
      setError(message);
      throw new Error(message);
    }
  };

  const resendOTP = async (userId: string, email: string) => {
    setError(null);
    try {
      const response = await api.post("/auth/resend-otp", { userId, email });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = useCallback(() => {
    api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        hasPermission,
        verifyOTP,
        resendOTP,
        clearError,
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