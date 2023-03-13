import { useMemo } from 'react';
import { ContractName, getContract } from '../utils/contractHelpers';
import useWeb3 from './useWeb3';

/**
 * Helper hooks to get specific contracts (by ABI)
 */
export const useContract = (contract: ContractName, provider?: any) => {
  const web3 = useWeb3(provider);
  return useMemo(() => getContract(contract, web3), [contract, web3]);
};
