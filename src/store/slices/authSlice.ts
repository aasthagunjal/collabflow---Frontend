import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/common';
import { AuthResponse } from '../../types/auth';
import { STORAGE_KEYS } from '../../constants/storageKeys';

interface AuthState {
  currentUser: User | null;
  authRoute: 'login' | 'register';
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Rehydrate from existing session
const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

const initialState: AuthState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  authRoute: 'login',
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ── Login ──────────────────────────────────────────────
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { user, token, refreshToken } = action.payload;
      state.currentUser = user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Register ───────────────────────────────────────────
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = false; // register does not issue tokens; user must log in
      state.isLoading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Shared ─────────────────────────────────────────────
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.authRoute = 'login';
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    setAuthRoute: (state, action: PayloadAction<'login' | 'register'>) => {
      state.authRoute = action.payload;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setAuthRoute,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
