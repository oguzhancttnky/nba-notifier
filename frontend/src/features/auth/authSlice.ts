import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.email = action.payload;
    },
    authenticate: (state) => {
        state.isAuthenticated = true;
    },
    revokeAuthenticate: (state) => {
        state.isAuthenticated = false
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
    },
  },
});

export const { login, logout, authenticate, revokeAuthenticate } = authSlice.actions;
export default authSlice.reducer;
