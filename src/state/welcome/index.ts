import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WelcomeState } from '../types';

const initialState: WelcomeState = {
  getFreeHero: false,
};

export const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    getFreeHero: (state, action: PayloadAction<boolean>) => {
      state.getFreeHero = action.payload;
    },
  },
});

// Actions
export const { getFreeHero } = welcomeSlice.actions;

export default welcomeSlice.reducer;
