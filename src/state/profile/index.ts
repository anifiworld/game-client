import {
  Action,
  AnyAction,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { ConnectorNames } from '../../types/ConnectorNames';
import { ProfileState } from '../types';
import { fetchUserAllowances } from './fetchUserAllowances';
import { fetchUserBalances } from './fetchUserBalances';
import { setAxiosClient } from '../../utils/axiosClient';


const detectDefaultLang = (): Language => {
  let targetLang: Language = 'en';
  if (navigator.language.startsWith('th')) targetLang = 'th';
  return targetLang;
};

interface RejectedAction extends Action {
  error: Error;
}

export function isUnauthorizedAction(
  action: AnyAction,
): action is RejectedAction {
  if (action.type.endsWith('rejected')) {
    const rejectAction = action as RejectedAction;
    return rejectAction.error.message.endsWith('401');
  }
  return false;
}

const initialState: ProfileState = {
  language: detectDefaultLang(),
  isLoggedIn: null,
  account: null,
  token: null,
  userProfile: null,
  allowances: [
    {
      name: 'vendor',
      allowance: new BigNumber(0),
    },
    {
      name: 'privateSale',
      allowance: new BigNumber(0),
    },
  ],
  balances: [
    {
      name: 'busd',
      balance: new BigNumber(0),
    },
    {
      name: 'aniToken',
      balance: new BigNumber(0),
    },
  ],
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setLoggedIn: (
      state,
      action: PayloadAction<{
        loginType: ConnectorNames;
        token: string;
        account: string;
      }>,
    ) => {
      state.isLoggedIn = action.payload.loginType;
      state.token = action.payload.token;
      state.account = action.payload.account;
      setAxiosClient(action.payload.token);
    },
    logout: (state) => {
      state.isLoggedIn = null;
      state.language = initialState.language;
      state.userProfile = null;
      state.account = null;
      state.token = null;
    },
    updateUserBalance: (state, action) => {
      state.balances = action.payload;
    },
    updateUserAllowance: (state, action) => {
      state.allowances = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isUnauthorizedAction, (state, action) => {
      return initialState;
    });
  },
});

// Actions
export const {
  setLoggedIn,
  setLanguage,
  logout,
  updateUserBalance,
  updateUserAllowance,
} = profileSlice.actions;

// Thunks
export const updateUserBalances =
  (tokenName: string, account: string) => async (dispatch: any) => {
    try {
      const { token } = await fetchUserBalances(tokenName, account);
      dispatch(
        updateUserBalance([
          // { name: 'busd', balance: busd },
          { name: tokenName, balance: token },
        ]),
      );
    } catch (e) {}
  };

export const clearUserBalances =
  (tokenName?: string) => async (dispatch: any) => {
    dispatch(
      updateUserBalance([
        { name: 'busd', balance: new BigNumber(0) },
        tokenName ? { name: tokenName, balance: new BigNumber(0) } : {},
      ]),
    );
  };

export const updateUserAllowances = (account: any) => async (dispatch: any) => {
  try {
    const { aniToken, nft, vendor, privateSale, staking } =
      await fetchUserAllowances(account);
    dispatch(
      updateUserAllowance([
        {
          name: 'aniToken',
          allowance: aniToken,
        },
        {
          name: 'nft',
          allowance: nft,
        },
        {
          name: 'vendor',
          allowance: vendor,
        },
        {
          name: 'privateSale',
          allowance: privateSale,
        },
        {
          name: 'staking',
          allowance: staking,
        },
      ]),
    );
  } catch (e) {}
};

export default profileSlice.reducer;