import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { secureStorage } from '../core/secureStorage';
import { productsSlice } from '../modules/products';
import { cartSlice } from '../modules/cart';
import { paymentSlice } from '../modules/payment';
import { transactionsSlice } from '../modules/transactions';

const persistConfig = {
  key: 'root',
  storage: secureStorage,
  whitelist: ['payment', 'transactions'], 
};

const rootReducer = combineReducers({
  products: productsSlice,
  cart: cartSlice,
  payment: paymentSlice,
  transactions: transactionsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;