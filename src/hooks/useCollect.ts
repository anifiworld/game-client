import { useCallback } from 'react';
import {collect} from 'utils/callHelpers';
import {useWeb3React} from '@web3-react/core';


const useCollect = () => {
  const { account } = useWeb3React()
  const handleCollect = useCallback(async (claimRewardsContract: any) => {
    try {
      if (!account) return
      const result = await collect(claimRewardsContract, account);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onCollect: handleCollect,
  };
};

export default useCollect;