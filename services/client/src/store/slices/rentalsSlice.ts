import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rentalService } from '../../services/rentalService';

interface Rental {
  id: string;
  rental_number: string;
  product_name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
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

export const fetchAllRentals = createAsyncThunk('rentals/fetchAll', async () => {
  const response = await rentalService.getAll();
  return response.data || [];
});

export const fetchActiveRentals = createAsyncThunk('rentals/fetchActive', async () => {
  const response = await rentalService.getActive();
  return response.data || [];
});

export const fetchOverdueRentals = createAsyncThunk('rentals/fetchOverdue', async () => {
  const response = await rentalService.getOverdue();
  return response.data || [];
});

export const fetchUserRentals = createAsyncThunk('rentals/fetchUser', async () => {
  const response = await rentalService.getUserRentals();
  return response.data || [];
});

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
        state.error = action.error.message || 'Failed to load rentals';
      })
      .addCase(fetchActiveRentals.fulfilled, (state, action) => {
        state.activeRentals = action.payload;
      })
      .addCase(fetchOverdueRentals.fulfilled, (state, action) => {
        state.overdueRentals = action.payload;
      })
      .addCase(fetchUserRentals.fulfilled, (state, action) => {
        state.rentals = action.payload;
      });
  },
});

export const { clearRentals } = rentalsSlice.actions;
export default rentalsSlice.reducer;