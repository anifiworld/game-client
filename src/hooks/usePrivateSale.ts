import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  buyPrivateSale,
  getPrivateSaleData,
  getQuoteTokenAmount,
  getUserWallet,
} from 'utils/callHelpers';

const usePrivateSale = () => {
  const { account } = useWeb3React();
  const handleBuyPrivateSale = useCallback(
    async (privateSaleContract: any, amount: number) => {
      try {
        const result = await buyPrivateSale(
          privateSaleContract,
          account!,
          new BigNumber(amount * 10 ** 18),
        );
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleGetPrivateSaleData = useCallback(
    async (privateSaleContract: any) => {
      const result = await getPrivateSaleData(privateSaleContract);
      return result;
    },
    [],
  );
  const handleGetQuoteTokenAmount = useCallback(
    async (privateSaleContract: any, amount: number) => {
      const result = await getQuoteTokenAmount(
        privateSaleContract,
        new BigNumber(amount).multipliedBy(10 ** 18),
      );
      return new BigNumber(result).dividedBy(10 ** 18).toNumber();
    },
    [],
  );
  const handleGetUserWallet = useCallback(
    async (privateSaleContract: any) => {
      const result = await getUserWallet(privateSaleContract, account!);
      return result;
    },
    [account],
  );
  return {
    onBuyPrivateSale: handleBuyPrivateSale,
    onGetPrivateSaleData: handleGetPrivateSaleData,
    onGetUserWallet: handleGetUserWallet,
    onGetQuoteTokenAmount: handleGetQuoteTokenAmount,
  };
};

export default usePrivateSale;
