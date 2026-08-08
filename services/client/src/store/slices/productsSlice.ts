import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import { Product } from '../../types';

interface ProductsState {
  products: Product[];
  categories: string[];
  brands: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  brands: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params?: Record<string, any>) => {
    const response = await productService.getAll(params);
    return response;
  }
);

export const fetchCategories = createAsyncThunk('products/categories', async () => {
  const response = await productService.getCategories();
  return response.data || [];
});

export const fetchBrands = createAsyncThunk('products/brands', async () => {
  const response = await productService.getBrands();
  return response.data || [];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;