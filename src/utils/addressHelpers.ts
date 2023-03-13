import nft from '../constants/NFT';
import privateSale from '../constants/PrivateSale';
import staking from '../constants/Staking';
import tokens from '../constants/Tokens';
import vendor from '../constants/Vendor';
import { ContractName, getContractMeta } from './contractHelpers';

export const getAddress = (contract: ContractName): string => {
  const networkId = process.env
    .REACT_APP_NETWORK_ID! as unknown as keyof Address;
  switch (contract) {
    case ContractName.ERC20:
    case ContractName.AniToken:
      return tokens.aniToken.address![networkId]!.address!;
    case ContractName.ERC1155:
      return nft.address[networkId];
    case ContractName.Vendor:
      return vendor.address[networkId];
    case ContractName.PrivateSale:
      return privateSale.address[networkId];
    case ContractName.Staking:
      return staking.address[networkId];
  }
  return getContractMeta(contract).networks[networkId]?.address || '';
};
