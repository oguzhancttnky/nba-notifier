import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscriptions: subscriptionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
