import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionsState {
  subscribedTeams: number[];
}

const initialState: SubscriptionsState = {
    subscribedTeams: [],
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    subscribe: (state, action: PayloadAction<number>) => {
        state.subscribedTeams = [...state.subscribedTeams, action.payload];
    },
    unsubscribe: (state, action: PayloadAction<number>) => {
      state.subscribedTeams = state.subscribedTeams.filter(subscribedTeamID => subscribedTeamID !== action.payload);
    },
    toInital: (state) => {
        state.subscribedTeams = [];
    },
  },
});

export const { subscribe, unsubscribe, toInital } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
