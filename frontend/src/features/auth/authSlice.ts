import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userID: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userID: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<number>) => {
      state.isAuthenticated = true;
      state.userID = action.payload;
    },
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
    revokeAuthenticate: (state) => {
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userID = null;
    },
  },
});

export const { login, logout, authenticate, revokeAuthenticate } =
  authSlice.actions;
export default authSlice.reducer;
