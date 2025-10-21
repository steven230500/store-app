import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../core/api';
import { AppTransaction } from '../../../core/types';

interface CheckoutRequest {
  productId: string;
  email: string;
  amountInCents: number;
  installments: number;
  card: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  };
}

interface CheckoutResponse {
  transaction: AppTransaction;
}

interface TransactionsState {
  current?: AppTransaction;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  loading: false,
  error: null,
};

export const fetchTransaction = createAsyncThunk(
  'transactions/fetchTransaction',
  async (transactionId: string) => {
    const response = await api.get<AppTransaction>(`/transactions/${transactionId}`);
    return response.data;
  }
);

export const processCheckout = createAsyncThunk(
  'transactions/processCheckout',
  async (checkoutData: CheckoutRequest) => {
    const response = await api.post<CheckoutResponse>('/payments/checkout', checkoutData);
    return response.data.transaction;
  }
);


const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransaction: (state) => {
      state.current = undefined;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transaction';
      })
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process checkout';
      });
  },
});

export const { clearTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;