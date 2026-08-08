import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import { Product } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const response = await cartService.getCart();
  return response.items || [];
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (productId: string) => {
    const response = await cartService.addItem(productId);
    return response;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId: string) => {
    await cartService.removeItem(productId);
    return productId;
  }
);

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await cartService.clearCart();
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    optimisticAdd: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    optimisticRemove: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load cart';
      })
      .addCase(addToCart.fulfilled, (state) => {
        // Cart updated on server, but we rely on optimistic updates for UI
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { optimisticAdd, optimisticRemove } = cartSlice.actions;
export default cartSlice.reducer;