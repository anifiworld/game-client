import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../state';
import { approveERC20 } from '../utils/callHelpers';
import { ContractName } from '../utils/contractHelpers';
import { useContract } from './useContract';

export const useERC20ContractCall = (provider?: any) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const gcrContract = useContract(ContractName.ERC20, provider);
  const handleApprove = useCallback(
    async (operatorAddress: string) => {
      // @ts-ignore
      if (account) await approveERC20(gcrContract, operatorAddress, account);
    },
    [account, gcrContract],
  );

  return { approve: handleApprove };
};
