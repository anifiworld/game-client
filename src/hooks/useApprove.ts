import { useCallback } from 'react';
import { useAppDispatch } from 'state';
import { useWeb3React } from '@web3-react/core';
import { approveERC20 } from 'utils/callHelpers';
import { updateUserAllowances } from 'state/profile';

const useApprove = (tokenContract: any, operatorContract: string) => {
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveERC20(tokenContract, operatorContract, account!);
      dispatch(updateUserAllowances(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, operatorContract, tokenContract]);

  return {
    onApprove: handleApprove,
  };
};

export default useApprove;
