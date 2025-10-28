import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { Invoice, InvoicePayload } from '@types/invoice';

type InvoiceState = {
  items: Invoice[];
  loading: boolean;
  error: string | null;
};

const initialState: InvoiceState = {
  items: [],
  loading: false,
  error: null
};

export const fetchInvoices = createAsyncThunk<Invoice[], void, { rejectValue: string }>(
  'invoices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Invoice[]>('/invoices');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error cargando facturas');
    }
  }
);

export const createInvoice = createAsyncThunk<Invoice, InvoicePayload, { rejectValue: string }>(
  'invoices/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<Invoice>('/invoices', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible crear la factura');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error cargando facturas';
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default invoiceSlice.reducer;
