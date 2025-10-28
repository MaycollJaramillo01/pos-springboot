import axios from 'axios';
import type { Store } from '@reduxjs/toolkit';
import { ENV } from '@config/env';
import type { RootState } from '@app/store';

const httpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setupHttpClient = (store: Store<RootState>) => {
  httpClient.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default httpClient;
