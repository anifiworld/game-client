import { Contract } from 'web3-eth-contract';

export const getGasPrice = async (contract: Contract, defaultGas: number) => {
  return defaultGas;
};
