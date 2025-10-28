import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { Order, OrderPayload } from '@types/order';

type OrderState = {
  items: Order[];
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  items: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Order[]>('/orders');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error cargando órdenes');
    }
  }
);

export const createOrder = createAsyncThunk<Order, OrderPayload, { rejectValue: string }>(
  'orders/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<Order>('/orders', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible crear la orden');
    }
  }
);

export const deleteOrder = createAsyncThunk<number, number, { rejectValue: string }>(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/orders/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible eliminar la orden');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error cargando órdenes';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default orderSlice.reducer;
