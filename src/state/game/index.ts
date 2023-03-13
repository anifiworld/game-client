import { 
  createSlice, 
  PayloadAction
} from '@reduxjs/toolkit';
import { isUnauthorizedAction, logout } from '../profile';
import { GameState } from '../types';

const initialState: GameState = {
  isHome: false,
  isBattle: false,
  showModal: false,
  currentStamina: 0,
  currentGold: 0,
  isPlaying: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<undefined>) => undefined,
    setIsHome: (state, action: PayloadAction<boolean>) => {
      state.isHome = action.payload;
    },
    setIsBattle: (state, action: PayloadAction<boolean>) => {
      state.isBattle = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setStamina: (state, action: PayloadAction<number>) => {
      state.currentStamina = action.payload;
    },
    setGold: (state, action: PayloadAction<number>) => {
      state.currentGold = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => initialState)
      .addMatcher(isUnauthorizedAction, (state) => initialState);
  },
});

// Actions
export const { 
  initGame,
  setIsHome,
  setIsBattle,
  setShowModal,
  setStamina,
  setGold,
  setIsPlaying,
} = gameSlice.actions;

export default gameSlice.reducer;
