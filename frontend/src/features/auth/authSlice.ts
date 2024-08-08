import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userid: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userid: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<number>) => {
      state.isAuthenticated = true;
      state.userid = action.payload;
    },
    authenticate: (state) => {
        state.isAuthenticated = true;
    },
    revokeAuthenticate: (state) => {
        state.isAuthenticated = false
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userid = null;
    },
  },
});

export const { login, logout, authenticate, revokeAuthenticate } = authSlice.actions;
export default authSlice.reducer;
