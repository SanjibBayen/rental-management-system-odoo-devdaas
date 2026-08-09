import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Rental {
  id: string;
  rental_number: string;
  product_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'pending' | 'overdue' | 'returned' | 'cancelled';
  total_amount: number;
  customer_name?: string;
  product_image?: string;
}

interface RentalsState {
  rentals: Rental[];
  activeRentals: Rental[];
  overdueRentals: Rental[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RentalsState = {
  rentals: [],
  activeRentals: [],
  overdueRentals: [],
  isLoading: false,
  error: null,
};

export const fetchAllRentals = createAsyncThunk(
  'rentals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rentals');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load rentals');
    }
  }
);

export const fetchActiveRentals = createAsyncThunk(
  'rentals/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rentals/active');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load active rentals');
    }
  }
);

export const fetchOverdueRentals = createAsyncThunk(
  'rentals/fetchOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rentals/overdue');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load overdue rentals');
    }
  }
);

export const fetchUserRentals = createAsyncThunk(
  'rentals/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rentals/user');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load your rentals');
    }
  }
);

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    clearRentals: (state) => {
      state.rentals = [];
      state.activeRentals = [];
      state.overdueRentals = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Rentals (Admin)
      .addCase(fetchAllRentals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRentals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rentals = action.payload;
      })
      .addCase(fetchAllRentals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to load rentals';
      })

      // Fetch Active Rentals (Admin)
      .addCase(fetchActiveRentals.fulfilled, (state, action) => {
        state.activeRentals = action.payload;
      })

      // Fetch Overdue Rentals (Admin)
      .addCase(fetchOverdueRentals.fulfilled, (state, action) => {
        state.overdueRentals = action.payload;
      })

      // Fetch User Rentals (Customer)
      .addCase(fetchUserRentals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRentals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rentals = action.payload;
      })
      .addCase(fetchUserRentals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to load your rentals';
      });
  },
});

export const { clearRentals } = rentalsSlice.actions;
export default rentalsSlice.reducer;