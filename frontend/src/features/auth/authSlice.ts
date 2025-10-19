import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from '@api/httpClient';
import { AuthResponse, AuthUser, LoginRequest } from '@types/auth';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Credenciales inválidas';
      return rejectWithValue(message);
    }
  }
);

export const refreshProfile = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<AuthUser>('/auth/me');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'No fue posible obtener el perfil';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Error al iniciar sesión';
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshProfile.rejected, (state, action) => {
        state.error = action.payload ?? 'Error obteniendo perfil';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
