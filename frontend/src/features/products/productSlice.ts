import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { Product, ProductPayload } from '@types/product';

type ProductState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error cargando productos');
    }
  }
);

export const createProduct = createAsyncThunk<Product, ProductPayload, { rejectValue: string }>(
  'products/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<Product>('/products', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible crear el producto');
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: ProductPayload },
  { rejectValue: string }
>('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await httpClient.put<Product>(`/products/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'No fue posible actualizar el producto');
  }
});

export const deleteProduct = createAsyncThunk<number, number, { rejectValue: string }>(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible eliminar el producto');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error cargando productos';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
