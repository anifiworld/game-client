// Slices states
import BigNumber from 'bignumber.js';
import { ConnectorNames } from '../types/ConnectorNames';

export interface UserProfile {
  display_image: {
    key: string;
    url: string;
  };
  display_name: string;
}

export interface ProfileState {
  language: Language;
  token: string | null;
  account: string | null;
  isLoggedIn: ConnectorNames | null;
  userProfile: UserProfile | null;
  allowances: Array<{ name: string; allowance: BigNumber }>;
  balances: Array<{ name: string; balance: BigNumber }>;
}

export interface WelcomeState {
  getFreeHero: boolean;
}

export interface GameState {
  isHome: boolean;
  isBattle: boolean;
  showModal: boolean;
  currentStamina: number;
  currentGold: number;
  isPlaying: boolean;
}

export enum SETTING_KEY {
  BGM_VOLUME = 'BGM_VOLUME',
  EFFECT_VOLUME = 'EFFECT_VOLUME',
}

export interface SettingState {
  config: {
    [SETTING_KEY.BGM_VOLUME]: number;
    [SETTING_KEY.EFFECT_VOLUME]: number;
  };
}

// Global state
export interface State {
  profile: ProfileState;
  game: GameState;
  welcome: WelcomeState;
  setting: SettingState;
}