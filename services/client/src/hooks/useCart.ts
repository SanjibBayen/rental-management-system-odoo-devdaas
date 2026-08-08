import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";
import { api } from "../services/api";
import { useAuth } from "./useAuth";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/cart");
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      // Optimistic update
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...current, { ...product, quantity: 1 }];
      });

      // Sync with backend
      await api.post("/cart/add", { productId: product.id });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Revert optimistic update if needed
      fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      // Optimistic update
      setItems((current) => current.filter((item) => item.id !== productId));

      // Sync with backend
      await api.delete(`/cart/remove/${productId}`);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      fetchCart();
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
      await api.delete("/cart/clear");
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0,
  );

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        items,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      },
    },
    children,
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
