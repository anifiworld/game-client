import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  decomposeHero,
  decomposeHeroBatch,
  mintFirstHero,
  _isInitialized,
} from '../utils/callHelpers';

const useGetHero = () => {
  const { account } = useWeb3React();
  const handleGetHero = useCallback(
    async (heroContract: any) => {
      try {
        const result = await mintFirstHero(heroContract, account!);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleGotHero = useCallback(
    async (heroContract: any) => {
      try {
        const result = await _isInitialized(heroContract, account!);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleDecomposeHero = useCallback(
    async (heroContract: any, heroId: string) => {
      try {
        const result = await decomposeHero(heroContract, account!, heroId);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleDecomposeHeroBatch = useCallback(
    async (heroContract: any, heroIds: string[]) => {
      try {
        const result = await decomposeHeroBatch(
          heroContract,
          account!,
          heroIds,
        );
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  return {
    onGetHero: handleGetHero,
    onGotHero: handleGotHero,
    onDecomposeHero: handleDecomposeHero,
    onDecomposeHeroBatch: handleDecomposeHeroBatch,
  };
};

export default useGetHero;
