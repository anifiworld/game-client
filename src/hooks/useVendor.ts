import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { openGachaHero, buyItem } from '../utils/callHelpers';

const useVendor = () => {
  const { account } = useWeb3React();
  const handleBuyItem = useCallback(
    async (vendorContract: any, itemId: string, amount: number) => {
      try {
        const result = await buyItem(
          vendorContract,
          new BigNumber(itemId),
          new BigNumber(amount),
          account!,
        );
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handelOpenGachaHero = useCallback(
    async (vendorContract: any, type: number, amount: number) => {
      try {
        const result = await openGachaHero(
          vendorContract,
          account!,
          type,
          amount,
        );
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );

  return { onBuyItem: handleBuyItem, onOpenGachaHero: handelOpenGachaHero };
};

export default useVendor;
