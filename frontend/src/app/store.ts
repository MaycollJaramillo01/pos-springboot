import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@features/auth/authSlice';
import productReducer from '@features/products/productSlice';
import categoryReducer from '@features/categories/categorySlice';
import inventoryReducer from '@features/inventories/inventorySlice';
import orderReducer from '@features/orders/orderSlice';
import invoiceReducer from '@features/invoices/invoiceSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  categories: categoryReducer,
  inventories: inventoryReducer,
  orders: orderReducer,
  invoices: invoiceReducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
