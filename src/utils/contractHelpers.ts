import AniTokenAbi from 'contracts/AniToken.json';
import HeroAbi from 'contracts/Hero.json';
// Contract Meta
import NFT from 'contracts/NFT.json';
import PrivateSaleAbi from 'contracts/PrivateSale.json';
import Staking from 'contracts/Staking.json';
import USDTokenAbi from 'contracts/USDToken.json';
import UtilsAbi from 'contracts/Utils.json';
import VendorAbi from 'contracts/Vendor.json';
import {AbiItem} from 'web3-utils';
import Web3 from 'web3';
import {getAddress} from './addressHelpers';
import ClaimRewards from 'contracts/ClaimRewards.json';

export enum ContractName {
  ERC20,
  ERC1155,
  Hero,
  Vendor,
  AniToken,
  Utils,
  PrivateSale,
  USDToken,
  Staking,
  ClaimRewards
}

export const getAbi = (contract: ContractName) => {
  return getContractMeta(contract).abi;
};
export const getContractMeta = (contract: ContractName): ContractMeta => {
  switch (contract) {
    case ContractName.ERC20:
      return AniTokenAbi;
    case ContractName.ERC1155:
      return NFT;
    case ContractName.Hero:
      return HeroAbi;
    case ContractName.Vendor:
      return VendorAbi;
    case ContractName.AniToken:
      return AniTokenAbi;
    case ContractName.Utils:
      return UtilsAbi;
    case ContractName.PrivateSale:
      return PrivateSaleAbi;
    case ContractName.USDToken:
      return USDTokenAbi;
    case ContractName.Staking:
      return Staking;
    case ContractName.ClaimRewards:
      return ClaimRewards
  }
};
export const getContract = (contract: ContractName, web3: Web3) => {
  return new web3.eth.Contract(
    getAbi(contract) as unknown as AbiItem,
    getAddress(contract),
  );
};
