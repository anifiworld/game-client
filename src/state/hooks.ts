import { useSelector } from 'react-redux';
import { State } from './types';

export const useCurrentLanguage = () => {
  return useSelector((state: State) => state.profile.language);
};

export const useIsLoggedIn = () => {
  return useSelector((state: State) => state.profile.isLoggedIn);
};

export const useAccount = () => {
  return useSelector((state: State) => state.profile.account);
};

export const useProfile = () => {
  return useSelector((state: State) => state.profile.userProfile);
};

export const useToken = () => {
  return useSelector((state: State) => state.profile.token);
};

export const useWelcome = () => {
  return useSelector((state: State) => state.welcome.getFreeHero);
};

export const useUserBalances = () => {
  return useSelector((state: State) => state.profile.balances);
};

export const useUserAllowances = () => {
  return useSelector((state: State) => state.profile.allowances);
};

export const useSettings = () => {
  return useSelector((state: State) => state.setting.config);
};

export const useIsHome = () => {
  return useSelector((state: State) => state.game.isHome);
};

export const useIsBattle = () => {
  return useSelector((state: State) => state.game.isBattle);
};

export const useShowModal = () => {
  return useSelector((state: State) => state.game.showModal);
};

export const useStamina = () => {
  return useSelector((state: State) => state.game.currentStamina);
};

export const useGold = () => {
  return useSelector((state: State) => state.game.currentGold);
};

export const useIsPlaying = () => {
  return useSelector((state: State) => state.game.isPlaying);
};


