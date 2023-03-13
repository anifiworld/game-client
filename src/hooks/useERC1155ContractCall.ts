import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../state';
import { approveERC1155 } from '../utils/callHelpers';
import { ContractName } from '../utils/contractHelpers';
import { useContract } from './useContract';

export const useERC1155ContractCall = () => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const nftContract = useContract(ContractName.ERC1155);
  const handleApprove = useCallback(
    async (operatorAddress: string) => {
      // @ts-ignore
      if (account) await approveERC1155(nftContract, operatorAddress, account);
    },
    [account, nftContract],
  );

  return { approve: handleApprove };
};
