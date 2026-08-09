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
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{
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

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  // Check for existing token on mount with validation
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // Validate token with backend before restoring session
            try {
              const response = await api.get("/auth/verify-token");
              
              // If token is valid, use the fresh user data from backend
              const backendUser = response.data.user || response.data;
              const mappedUser: User = {
                id: backendUser.id,
                name: backendUser.full_name || backendUser.name || parsedUser.name,
                email: backendUser.email || parsedUser.email,
                role: (backendUser.role as Role) || parsedUser.role,
                permissions: getPermissionsForRole((backendUser.role as Role) || parsedUser.role),
              };
              
              setUser(mappedUser);
              localStorage.setItem("user", JSON.stringify(mappedUser));
            } catch (validationError) {
              // Token is invalid, clear storage
              console.warn("Stored token is invalid, clearing session");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          } catch (parseError) {
            // Invalid JSON in localStorage
            console.error("Invalid user data in localStorage");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Setup axios interceptor for automatic token handling
  useEffect(() => {
    // Request interceptor - add token to headers
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = config.headers || ({} as import("axios").AxiosRequestHeaders);
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Auto logout on unauthorized
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setError("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (email: string, password: string) => {
    setError(null);
    
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await api.post("/auth/login", { email, password });

      const { token, user: backendUser } = response.data;

      // Validate response data
      if (!token || !backendUser) {
        throw new Error("Invalid response from server");
      }

      // Store token
      localStorage.setItem("token", token);

      // Map backend user to frontend User with validation
      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.full_name || backendUser.name || 'Unknown User',
        email: backendUser.email || email,
        role: (backendUser.role as Role) || 'customer',
        permissions: getPermissionsForRole((backendUser.role as Role) || 'customer'),
      };

      // Validate mapped user
      if (!mappedUser.id) {
        throw new Error("Invalid user data received");
      }

      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
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
    setError(null);
    
    try {
      // Input validation
      if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

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

      // Validate response
      if (!userId) {
        throw new Error("Invalid response from server: missing userId");
      }

      // Return success data; frontend can redirect to OTP page
      return { 
        userId, 
        userEmail: userEmail || email, 
        requiresEmailVerification: requiresEmailVerification !== false 
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================
  const verifyOTP = async (userId: string, otp: string) => {
    setError(null);
    
    try {
      if (!userId || !otp) {
        throw new Error("User ID and OTP are required");
      }

      const response = await api.post("/auth/verify-otp", { userId, otp });
      
      // If verification returns user data and token, auto-login
      if (response.data.token && response.data.user) {
        const { token, user: backendUser } = response.data;
        
        localStorage.setItem("token", token);
        
        const mappedUser: User = {
          id: backendUser.id,
          name: backendUser.full_name || backendUser.name,
          email: backendUser.email,
          role: backendUser.role as Role,
          permissions: getPermissionsForRole(backendUser.role as Role),
        };
        
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setUser(mappedUser);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "OTP verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ============================================================
  // RESEND OTP
  // ============================================================
  const resendOTP = async (userId: string, email: string) => {
    setError(null);
    
    try {
      if (!userId || !email) {
        throw new Error("User ID and email are required");
      }

      const response = await api.post("/auth/resend-otp", { userId, email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = useCallback(() => {
    // Try to call logout API to invalidate token on server
    api.post("/auth/logout").catch(() => {
      // Silently fail if logout API fails
    });

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Reset state
    setUser(null);
    setError(null);
  }, []);

  // ============================================================
  // PERMISSION CHECK
  // ============================================================
  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  }, [user]);

  // Context value with memoized functions
  const contextValue = {
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
