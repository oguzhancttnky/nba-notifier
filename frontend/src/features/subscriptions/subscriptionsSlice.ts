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
        if (state.subscribedTeams.length > 5) {
            console.log('Maximum subscriptions reached');
            return;
        }
        state.subscribedTeams = [...state.subscribedTeams, action.payload];
    },
    unsubscribe: (state, action: PayloadAction<number>) => {
      state.subscribedTeams = state.subscribedTeams.filter(subscribedTeamID => subscribedTeamID !== action.payload);
    },
  },
});

export const { subscribe, unsubscribe } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
