import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../../core/types';

interface CartState {
  items: CartItem[];
  total_in_cents: number;
}

const initialState: CartState = {
  items: [],
  total_in_cents: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: CartItem; qty: number }>) => {
      const { product, qty } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.product_id);
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        state.items.push({ ...product, qty });
      }
      state.total_in_cents = state.items.reduce((total, item) => total + item.price_in_cents * item.qty, 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
      state.total_in_cents = state.items.reduce((total, item) => total + item.price_in_cents * item.qty, 0);
    },
    setQty: (state, action: PayloadAction<{ product_id: string; qty: number }>) => {
      const { product_id, qty } = action.payload;
      const item = state.items.find(item => item.product_id === product_id);
      if (item) {
        item.qty = qty;
        if (item.qty <= 0) {
          state.items = state.items.filter(item => item.product_id !== product_id);
        }
      }
      state.total_in_cents = state.items.reduce((total, item) => total + item.price_in_cents * item.qty, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total_in_cents = 0;
    },
  },
});

export const { addItem, removeItem, setQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;