import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { Inventory, InventoryPayload } from '@types/inventory';

type InventoryState = {
  items: Inventory[];
  loading: boolean;
  error: string | null;
};

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null
};

export const fetchInventories = createAsyncThunk<Inventory[], void, { rejectValue: string }>(
  'inventories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Inventory[]>('/inventories');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error cargando inventarios');
    }
  }
);

export const createInventory = createAsyncThunk<Inventory, InventoryPayload, { rejectValue: string }>(
  'inventories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<Inventory>('/inventories', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible crear el inventario');
    }
  }
);

export const updateInventory = createAsyncThunk<
  Inventory,
  { id: number; data: Partial<InventoryPayload> },
  { rejectValue: string }
>('inventories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await httpClient.put<Inventory>(`/inventories/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'No fue posible actualizar el inventario');
  }
});

const inventorySlice = createSlice({
  name: 'inventories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error cargando inventarios';
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      });
  }
});

export default inventorySlice.reducer;
