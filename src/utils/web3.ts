import random from 'lodash/random';
import { HttpProviderOptions } from 'web3-core-helpers';
import Web3 from 'web3';
import { getNodeUrl, nodes } from './getRpcUrl';

const httpProviders = [
  new Web3.providers.HttpProvider(getNodeUrl(0)!, {
    timeout: 10000,
  } as HttpProviderOptions),
  new Web3.providers.HttpProvider(getNodeUrl(1)!, {
    timeout: 10000,
  } as HttpProviderOptions),
  new Web3.providers.HttpProvider(getNodeUrl(2)!, {
    timeout: 10000,
  } as HttpProviderOptions),
];
let web3NoAccount = new Web3(httpProviders[random(0, nodes.length - 1)]);
const reRandomRPCServer = () => {
  web3NoAccount = new Web3(httpProviders[random(0, nodes.length - 1)]);
};

const getWeb3NoAccount = () => web3NoAccount;

export { getWeb3NoAccount, reRandomRPCServer };
