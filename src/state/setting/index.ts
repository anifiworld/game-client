import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../profile';
import { SETTING_KEY, SettingState } from '../types';

const initialState: SettingState = {
  config: {
    [SETTING_KEY.BGM_VOLUME]: 100,
    [SETTING_KEY.EFFECT_VOLUME]: 100,
  },
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    changeSetting: (
      state,
      action: PayloadAction<{
        key: SETTING_KEY;
        value: any;
      }>,
    ) => {
      switch (action.payload.key) {
        case SETTING_KEY.BGM_VOLUME:
        case SETTING_KEY.EFFECT_VOLUME:
          state.config[action.payload.key] = action.payload.value;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => initialState);
  },
});

// Actions
export const { changeSetting } =
  settingSlice.actions;

export default settingSlice.reducer;
