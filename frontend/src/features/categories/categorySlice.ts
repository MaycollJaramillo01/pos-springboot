import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { Category, CategoryPayload } from '@types/category';

type CategoryState = {
  items: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Category[]>('/categories');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Error cargando categorías');
    }
  }
);

export const createCategory = createAsyncThunk<Category, CategoryPayload, { rejectValue: string }>(
  'categories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<Category>('/categories', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible crear la categoría');
    }
  }
);

export const updateCategory = createAsyncThunk<
  Category,
  { id: number; data: CategoryPayload },
  { rejectValue: string }
>('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await httpClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? 'No fue posible actualizar la categoría');
  }
});

export const deleteCategory = createAsyncThunk<number, number, { rejectValue: string }>(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/categories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'No fue posible eliminar la categoría');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error cargando categorías';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default categorySlice.reducer;
