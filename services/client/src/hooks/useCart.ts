import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Product } from "../types";
import { api } from "../services/api";
import { useAuth } from "./useAuth";

// Export CartItem type for use in other components
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
  itemCount: number; // Number of unique items
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage keys
const LOCAL_CART_KEY = "guest_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();

  // Refs for managing race conditions
  const syncInProgressRef = useRef(false);
  const pendingSyncRef = useRef(false);
  const previousItemsRef = useRef<CartItem[]>([]);

  // Load cart from localStorage for guest users
  const loadLocalCart = useCallback((): CartItem[] => {
    try {
      const savedCart = localStorage.getItem(LOCAL_CART_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Failed to load local cart:", error);
    }
    return [];
  }, []);

  // Save cart to localStorage for guest users
  const saveLocalCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save local cart:", error);
    }
  }, []);

  // Sync cart with backend (debounced)
  const syncCartWithBackend = useCallback(
    async (cartItems: CartItem[]) => {
      if (!user) return;

      if (syncInProgressRef.current) {
        pendingSyncRef.current = true;
        return;
      }

      syncInProgressRef.current = true;

      try {
        await api.put("/cart/sync", {
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        });
        setError(null);
      } catch (error: any) {
        console.error("Failed to sync cart with backend:", error);
        setError("Failed to sync cart. Your changes might not be saved.");

        // Restore previous state on sync failure
        setItems(previousItemsRef.current);
      } finally {
        syncInProgressRef.current = false;

        // Process pending sync if needed
        if (pendingSyncRef.current) {
          pendingSyncRef.current = false;
          syncCartWithBackend(items);
        }
      }
    },
    [user],
  );

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await api.get("/cart");

      const serverItems = response.data.items || [];

      // Merge with local cart if exists
      const localItems = loadLocalCart();
      if (localItems.length > 0) {
        // Merge server and local cart
        const mergedItems = mergeCartItems(serverItems, localItems);
        setItems(mergedItems);
        previousItemsRef.current = mergedItems;

        // Sync merged cart to server
        await syncCartWithBackend(mergedItems);

        // Clear local cart after merge
        localStorage.removeItem(LOCAL_CART_KEY);
      } else {
        setItems(serverItems);
        previousItemsRef.current = serverItems;
      }

      setError(null);
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      setError("Failed to load cart");

      // Fall back to local cart
      const localItems = loadLocalCart();
      setItems(localItems);
      previousItemsRef.current = localItems;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadLocalCart, syncCartWithBackend]);

  // Merge two cart item arrays
  const mergeCartItems = (
    serverItems: CartItem[],
    localItems: CartItem[],
  ): CartItem[] => {
    const merged = new Map<string, CartItem>();

    // Add server items
    serverItems.forEach((item) => {
      merged.set(item.id, { ...item });
    });

    // Merge local items
    localItems.forEach((localItem) => {
      const existing = merged.get(localItem.id);
      if (existing) {
        // Combine quantities if product exists in both
        existing.quantity = Math.max(existing.quantity, localItem.quantity);
      } else {
        merged.set(localItem.id, { ...localItem });
      }
    });

    return Array.from(merged.values());
  };

  // Initialize cart based on auth state
  useEffect(() => {
    // Don't do anything while auth is still loading
    if (isAuthLoading) return;

    if (user) {
      // User is logged in, fetch from backend
      fetchCart();
    } else {
      // Guest user, load from localStorage
      const localItems = loadLocalCart();
      setItems(localItems);
      previousItemsRef.current = localItems;
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchCart, loadLocalCart]);

  // Save to localStorage whenever cart changes for guest users
  useEffect(() => {
    if (!user && !isLoading) {
      saveLocalCart(items);
    }
  }, [items, user, isLoading, saveLocalCart]);

  // ============================================================
  // ADD TO CART
  // ============================================================
  const addToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (quantity <= 0) return;

      try {
        setError(null);

        let updatedItems: CartItem[];

        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          if (existing) {
            updatedItems = current.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          } else {
            updatedItems = [...current, { ...product, quantity }];
          }

          previousItemsRef.current = current; // Save for rollback
          return updatedItems;
        });

        // Sync with backend if user is logged in
        if (user) {
          await api.post("/cart/add", {
            productId: product.id,
            quantity,
          });
        }
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        setError("Failed to add item to cart");

        // Rollback optimistic update
        setItems(previousItemsRef.current);

        // Refresh from server if logged in
        if (user) {
          fetchCart();
        }
      }
    },
    [user, fetchCart],
  );

  // ============================================================
  // REMOVE FROM CART
  // ============================================================
  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        setError(null);

        setItems((current) => {
          previousItemsRef.current = current;
          return current.filter((item) => item.id !== productId);
        });

        if (user) {
          await api.delete(`/cart/remove/${productId}`);
        }
      } catch (error: any) {
        console.error("Failed to remove from cart:", error);
        setError("Failed to remove item from cart");
        setItems(previousItemsRef.current);

        if (user) {
          fetchCart();
        }
      }
    },
    [user, fetchCart],
  );

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        // If quantity is less than 1, remove the item
        await removeFromCart(productId);
        return;
      }

      try {
        setError(null);

        setItems((current) => {
          previousItemsRef.current = current;
          return current.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          );
        });

        if (user) {
          await api.put(`/cart/update/${productId}`, { quantity });
        }
      } catch (error: any) {
        console.error("Failed to update quantity:", error);
        setError("Failed to update quantity");
        setItems(previousItemsRef.current);

        if (user) {
          fetchCart();
        }
      }
    },
    [user, fetchCart, removeFromCart],
  );

  // ============================================================
  // CLEAR CART
  // ============================================================
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      previousItemsRef.current = items;
      setItems([]);

      if (user) {
        await api.delete("/cart/clear");
      } else {
        localStorage.removeItem(LOCAL_CART_KEY);
      }
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      setError("Failed to clear cart");
      setItems(previousItemsRef.current);
    }
  }, [user, items]);

  // ============================================================
  // CHECK IF ITEM IS IN CART
  // ============================================================
  const isInCart = useCallback(
    (productId: string): boolean => {
      return items.some((item) => item.id === productId);
    },
    [items],
  );

  // ============================================================
  // GET ITEM QUANTITY
  // ============================================================
  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = items.find((item) => item.id === productId);
      return item?.quantity || 0;
    },
    [items],
  );

  // ============================================================
  // CALCULATED VALUES
  // ============================================================
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.pricePerDay || 0) * item.quantity,
    0,
  );
  const itemCount = items.length; // Number of unique items

  const contextValue: CartContextType = {
    items,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    totalItems,
    totalPrice,
    itemCount,
  };

  return React.createElement(
    CartContext.Provider,
    { value: contextValue },
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
