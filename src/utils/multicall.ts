import { Interface } from '@ethersproject/abi';
import { AbiItem } from 'web3-utils';
import multicallContractMeta from '../contracts/MultiCall.json';
import { getWeb3NoAccount } from './web3';

interface Call {
  address: string; // Contract address
  name: string; // Function name on the contract
  params?: any[]; // Function params
}

const multicall = async (abi: any[], calls: Call[]) => {
  const web3 = getWeb3NoAccount();
  const chainId = process.env.REACT_APP_CHAIN_ID!;
  const multicallAbi = multicallContractMeta.abi;
  // @ts-ignore
  const multicallAddress = multicallContractMeta.networks[chainId].address;
  const multicallContract = new web3.eth.Contract(
    multicallAbi as unknown as AbiItem,
    multicallAddress,
  );
  const inf = new Interface(abi);
  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    inf.encodeFunctionData(call.name, call.params),
  ]);
  const { returnData } = await multicallContract.methods
    .aggregate(calldata)
    .call();
  const result = returnData.map((call: any, i: number) =>
    inf.decodeFunctionResult(calls[i].name, call),
  );
  return result;
};

export default multicall;
