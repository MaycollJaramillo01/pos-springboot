import { useMemo } from 'react';
import { useAppSelector } from './redux';

export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth);
  return useMemo(
    () => ({
      isAuthenticated: Boolean(authState.token),
      user: authState.user,
      token: authState.token,
      loading: authState.loading,
      error: authState.error
    }),
    [authState]
  );
};
