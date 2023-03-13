import { useMemo } from 'react';
import Web3 from 'web3';

const useWeb3 = (provider?: any) => {
  const web3 = useMemo(
    () => new Web3(provider || Web3.givenProvider),
    [provider],
  );
  return web3;
};

export default useWeb3;
