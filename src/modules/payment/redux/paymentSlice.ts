import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../core/api';
import { CheckoutDto, CheckoutResponse, AppTransaction } from '../../../core/types';

interface PaymentState {
  card: {
    number?: string;
    cvc?: string;
    exp_month?: string;
    exp_year?: string;
    card_holder?: string;
    email?: string;
    brand?: 'VISA' | 'MASTERCARD';
    bin?: string;
    last4?: string;
  };
  validation: {
    valid: boolean;
    errors: Record<string, string>;
  };
  checkout: {
    loading: boolean;
    error: string | null;
    transaction: AppTransaction | null;
  };
}

const initialState: PaymentState = {
  card: {},
  validation: {
    valid: false,
    errors: {},
  },
  checkout: {
    loading: false,
    error: null,
    transaction: null,
  },
};

export const checkout = createAsyncThunk(
  'payment/checkout',
  async (checkoutData: CheckoutDto) => {
    const response = await api.post<CheckoutResponse>('/payments/checkout', checkoutData);
    return response.data.transaction;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCard: (state, action: PayloadAction<Partial<PaymentState['card']>>) => {
      state.card = { ...state.card, ...action.payload };
    },
    clearCard: (state) => {
      state.card = {};
      state.validation = { valid: false, errors: {} };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.checkout.loading = true;
        state.checkout.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.checkout.loading = false;
        state.checkout.transaction = action.payload as unknown as AppTransaction;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.checkout.loading = false;
        state.checkout.error = action.error.message || 'Checkout failed';
      });
  },
});

export const { setCard, clearCard } = paymentSlice.actions;
export default paymentSlice.reducer;