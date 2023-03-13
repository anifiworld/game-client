import BigNumber from 'bignumber.js';
import tokens from 'constants/Tokens';
import _ from 'lodash';
import multicall from 'utils/multicall';

export const fetchUserBalances = async (tokenName: string, account: any) => {
  // @ts-ignore
  const { busd, [_.camelCase(tokenName)]: token } = tokens;
  const chainId = process.env.REACT_APP_CHAIN_ID;

  const calls = [
    // {
    //   // @ts-ignore
    //   address: busd.address?.[chainId]?.address,
    //   name: 'balanceOf',
    //   params: [account],
    // },
    {
      // @ts-ignore
      address: token.address?.[chainId]?.address,
      name: 'balanceOf',
      params: [account],
    },
  ];

  const ERC20ContractMeta = require('../../contracts/ERC20.json');
  const ERC20Abi = ERC20ContractMeta.abi;
  const result = await multicall(ERC20Abi, calls);
  // const busdBalance = new BigNumber(result[0][0]._hex).dividedBy(
  //   new BigNumber(10).pow(18),
  // );
  const tokenBalance = new BigNumber(result[0][0]._hex).dividedBy(
    new BigNumber(10).pow(18),
  );
  return {
    // busd: busdBalance,
    token: tokenBalance,
  };
};
