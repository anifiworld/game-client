import BigNumber from 'bignumber.js';
import nft from 'constants/NFT';
import privateSale from 'constants/PrivateSale';
import staking from 'constants/Staking';
import tokens from 'constants/Tokens';
import vendor from 'constants/Vendor';
import _ from 'lodash';
import multicall from 'utils/multicall';

export const fetchUserAllowances = async (account: string) => {
  const { aniToken, busd } = tokens;
  const chainId = process.env.REACT_APP_CHAIN_ID;

  const calls = [
    {
      // @ts-ignore
      address: aniToken.address?.[chainId]?.address,
      name: 'allowance',
      // @ts-ignore
      params: [account, aniToken.address?.[chainId]?.address],
    },
    {
      // @ts-ignore
      address: aniToken.address?.[chainId]?.address,
      name: 'allowance',
      // @ts-ignore
      params: [account, nft.address[chainId]],
    },
    {
      // @ts-ignore
      address: aniToken.address?.[chainId]?.address,
      name: 'allowance',
      // @ts-ignore
      params: [account, vendor.address[chainId]],
    },
    {
      // @ts-ignore
      address: busd.address?.[chainId]?.address,
      name: 'allowance',
      // @ts-ignore
      params: [account, privateSale.address[chainId]],
    },
    {
      // @ts-ignore
      address: aniToken.address?.[chainId]?.address,
      name: 'allowance',
      // @ts-ignore
      params: [account, staking.address[chainId]],
    },
  ];

  const ERC20ContractMeta = require('contracts/ERC20.json');
  const ERC20Abi = ERC20ContractMeta.abi;
  const result = await multicall(ERC20Abi, calls);
  const aniTokenAllowance = new BigNumber(result[0][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );
  const nftAllowance = new BigNumber(result[1][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );
  const vendorAllowance = new BigNumber(result[2][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );
  const privateSaleAllowance = new BigNumber(result[3][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );
  const stakingAllowance = new BigNumber(result[4][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );

  return {
    aniToken: aniTokenAllowance,
    nft: nftAllowance,
    vendor: vendorAllowance,
    privateSale: privateSaleAllowance,
    staking: stakingAllowance,
  };
};
