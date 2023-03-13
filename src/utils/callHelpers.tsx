import Link from '@mui/material/Link';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { map, toLower } from 'lodash';
import MiddleEllipsis from 'react-middle-ellipsis';
import { toast } from 'react-toastify';
import { Contract } from 'web3-eth-contract';
import { getAxiosClient } from './axiosClient';
import { getGasPrice } from './gasUtils';


const axios = getAxiosClient();

const getToast = async (tx: Promise<any>, successMessage?: string) => {
  const toastId = toast.loading('Waiting for confirmation');

  try {
    const { transactionHash } = await tx;
    toast.update(toastId, {
      render: (
        <>
          {successMessage}
          <Link
            href={`${process.env.REACT_APP_BLOCK_EXPLORER}/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              style={{
                color: '#616161',
                width: '50%',
                textDecoration: 'underline',
              }}
            >
              <MiddleEllipsis>
                <span>{transactionHash}</span>
              </MiddleEllipsis>
            </div>
          </Link>
        </>
      ),
      type: 'success',
      isLoading: false,
      autoClose: 5000,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
    return tx;
  } catch (e) {
    toast.update(toastId, {
      render: 'Transaction has been reverted',
      type: 'error',
      isLoading: false,
      autoClose: 5000,
    });
    throw e;
  }
};

export const approveERC20 = async (
  tokenContract: Contract,
  operatorAddress: string,
  account: string,
) => {
  const gasPrice = await getGasPrice(tokenContract, 10000000000);
  const tx = tokenContract.methods
    .approve(operatorAddress, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice });

  await getToast(tx, 'Approved spend limit');
};

export const approveERC1155 = async (
  nftContract: Contract,
  operatorAddress: string,
  account: string,
) => {
  const gasPrice = await getGasPrice(nftContract, 10000000000);
  return nftContract.methods
    .setApprovalForAll(operatorAddress, true)
    .send({ from: account, gasPrice })
    .on('transactionHash', (tx: any) => {
      return tx.transactionHash;
    });
};

export const mintFirstHero = async (
  heroContract: Contract,
  account: string,
) => {
  const gasPrice = await getGasPrice(heroContract, 10000000000);
  const tx = heroContract.methods
    .mintFirstHero()
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Obtained free heroes');
  } catch (err) {
    return false;
  }
  return true;
};

export const buyItem = async (
  vendorContract: Contract,
  itemId: BigNumber,
  amount: BigNumber,
  account: string,
) => {
  const gasPrice = await getGasPrice(vendorContract, 10000000000);
  const tx = vendorContract.methods
    .buyItem(itemId.toString(), amount.toString())
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Bought an item');
  } catch (err) {
    return false;
  }
  return true;
};

export const _isInitialized = async (
  heroContract: Contract,
  account: string,
) => {
  const tx = heroContract.methods._isInitialized(account).call();
  return tx;
};

export const getItems = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/items/user/item_list/`,
  );
  return result.data;
};

export const openGachaHero = async (
  vendorContract: Contract,
  account: string,
  type: number,
  amount: number,
) => {
  const gasPrice = await getGasPrice(vendorContract, 10000000000);
  const tx = vendorContract.methods
    .openGachaHero(type.toString(), amount.toString())
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Bought a gacha hero');
  } catch (err) {
    return false;
  }
  return true;
};

export const decomposeHero = async (
  heroContract: Contract,
  account: string,
  heroId: string,
) => {
  const gasPrice = await getGasPrice(heroContract, 10000000000);
  const tx = heroContract.methods
    .decomposeHero(heroId)
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Broke down a hero');
  } catch (err) {
    return false;
  }
  return true;
};

export const decomposeHeroBatch = async (
  heroContract: Contract,
  account: string,
  heroIds: string[],
) => {
  const gasPrice = await getGasPrice(heroContract, 10000000000);
  const tx = heroContract.methods
    .decomposeHeroBatch(heroIds)
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Broke down heroes');
  } catch (err) {
    return false;
  }
  return true;
};

export const getHeroType = async (utilsContract: Contract, heroId: string) => {
  const tx = utilsContract.methods.heroType(heroId).call();
  return tx;
};

export const getItemPrice = async (vendorContract: Contract, id: string) => {
  const price = await vendorContract.methods._priceMap(id).call();
  const actualPrice = await vendorContract.methods.getActualPrice(price).call();
  return actualPrice;
};

export const heroRarity = async (utilsContract: Contract, id: string) => {
  const tx = utilsContract.methods.heroRarity(id).call();
  return tx;
};

export const heroStats = async (heroContract: Contract, id: string) => {
  const tx = heroContract.methods._heroStats(id).call();
  return tx;
};

export const upgradeHero = async (
  heroContract: Contract,
  account: string,
  id: string,
) => {
  const gasPrice = await getGasPrice(heroContract, 10000000000);
  const tx = heroContract.methods.upgradeHero(id).send({
    from: account,
    gasPrice,
  });
  try {
    await getToast(tx, 'Hero upgraded');
  } catch (err) {
    return false;
  }
  return true;
};

export const getNonce = async (account: string) => {
  try {
    const response = await axios(
      `${process.env.REACT_APP_API_SERVER}/metamask/${account}/`,
    );
    if (response.status === 404) return false;
    const { nonce } = response.data;
    return nonce;
  } catch (e) {}
};

export const createNonce = async (account: string) => {
  const _account = toLower(account.split('0x')[1]);
  const response = await axios.post(
    `${process.env.REACT_APP_API_SERVER}/metamask/`,
    {
      public_address: account,
      user: {
        username: _account,
      },
    },
  );
  if (response.status !== 201) return false;
  const { nonce } = response.data;
  return nonce;
};

export const signIn = async (account: string, signature: string) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_SERVER}/metamask/login/${account}`,
    {
      signature,
    },
  );
  if (response.status !== 200) return false;

  return response.data;
};

export const buyPrivateSale = async (
  privateSaleContract: Contract,
  account: string,
  amount: BigNumber,
) => {
  const gasPrice = await getGasPrice(privateSaleContract, 10000000000);
  const tx = privateSaleContract.methods
    .buy(amount.toString())
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Bought private sale');
  } catch (err) {
    return false;
  }
  return true;
};

export const getPrivateSaleData = async (privateSaleContract: Contract) => {
  const totalSale = await privateSaleContract.methods.totalSale().call();
  const hardCap = await privateSaleContract.methods.LIMIT_SALE().call();
  const currentPrice = await privateSaleContract.methods
    .getCurrentPrice()
    .call();
  const minBuy = await privateSaleContract.methods.MIN_BUY().call();
  const maxBuy = await privateSaleContract.methods.MAX_BUY().call();
  const privateSaleTimestamp = await privateSaleContract.methods
    .privateSaleTimestamp()
    .call();
  const STEPUP_PERIOD = await privateSaleContract.methods
    .STEPUP_PERIOD()
    .call();
  const TOTAL_STEP = await privateSaleContract.methods.TOTAL_STEP().call();
  const tgeTimestamp = await privateSaleContract.methods.tgeTimestamp().call();

  return {
    totalSale,
    hardCap,
    currentPrice,
    minBuy,
    maxBuy,
    privateSaleTimestamp,
    tgeTimestamp,
    STEPUP_PERIOD,
    TOTAL_STEP,
  };
};

export const getUserWallet = async (
  privateSaleContract: Contract,
  account: string,
) => {
  const boughtAni = await privateSaleContract.methods
    .userWallet(account)
    .call();

  return boughtAni;
};

export const getQuoteTokenAmount = async (
  privateSaleContract: Contract,
  usdAmount: BigNumber,
) => {
  const quoteTokenAmount = privateSaleContract.methods
    .quoteTokenAmount(usdAmount.toString())
    .call();

  return quoteTokenAmount;
};

export const getHeroList = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/`, // TODO: waiting for the api implementation
  );
  return result.data;
};

export const getUserHeroList = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/hero_list/`,
  );
  return result.data;
};

export const getHeroTypes = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/types/`,
  );
  return result.data;
};

export const getUserHeroOnChainList = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/hero_on_chain_list/`,
  );
  return result.data;
};

export const getHeroSlots = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/hero_slots/`,
  );
  return result.data;
};

export const upDateHeroSlots = async (ids: string[] | undefined) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/hero_slots/`,
    ids,
  );
  return response;
};

export const getGemSlots = async (id: string) => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/gem_slots/${id}`,
  );
  return result.data;
};

export const updateGemSlots = async (
  id: string,
  gemList: { [key: string]: string },
) => {
  const result = axios.put(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/gem_slots/${id}`,
    gemList,
  );
  try {
    await getToast(result, 'Gem slots updated');
  } catch (err) {
    return false;
  }
  return (await result).data;
};

export const getPlayerInfo = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/player/info`,
  );
  return result.data;
};

export const getClaimReward = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/player/claim_reward/`,
    {
      method: 'GET',
    }
  );
  return result.data;
};

export const claimRewardTransaction = async (transaction: string, signature: string) => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/player/claim_reward/`,
    {
      method: 'POST',
      data: {
        transaction,
        signature,
      }
    }
  );
  return result.data;
};

export const getUserGemList = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/heroes/user/gem_list`,
  );
  return result.data;
};

export const getFreeHero = async (data: any) => {
  const result = await axios.put(
    `${process.env.REACT_APP_API_SERVER!}/player/get_free_heroes`,
    data,
  );
  return result.data;
};

export const requestingGacha = async (
  vendorContract: Contract,
  account: string,
) => {
  const gacha = await vendorContract.methods.gacha(account).call();
  return gacha._requestingGacha;
};

export const finishedRandom = async (
  vendorContract: Contract,
  account: string,
) => {
  const gacha = await vendorContract.methods.gacha(account).call();
  return gacha._finishedRandom;
};

export const claimGacha = async (vendorContract: Contract, account: string) => {
  const gasPrice = await getGasPrice(vendorContract, 10000000000);
  const tx = vendorContract.methods
    .claimGacha()
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Claimed a hero');
  } catch (err) {
    return false;
  }
  return tx;
};

export const enterStaking = async (
  stakingContract: Contract,
  account: string,
  amount: BigNumber,
  period: number,
) => {
  const gasPrice = await getGasPrice(stakingContract, 10000000000);
  const tx = stakingContract.methods
    .enterStaking(amount.toString(), period.toString())
    .send({ from: account, gasPrice });
  try {
    await getToast(
      tx,
      `Staked ${new BigNumber(amount).dividedBy(10 ** 18).toString()} ANIFI`,
    );
  } catch (err) {
    return false;
  }
  return true;
};

export const getStakingData = async (
  stakingContract: Contract,
  account: string,
) => {
  const Status: { [key: string]: string } = {
    '0': 'Locked',
    '1': 'Withdraw',
    '2': 'Withdrawn',
  };
  const totalStakedAmount = await stakingContract.methods
    .totalStakedAmount()
    .call();
  const userTotalStakedAmount = await stakingContract.methods
    .userTotalStakedAmount(account)
    .call();
  const userStakedTime = await stakingContract.methods
    .userStakedTime(account)
    .call();
  const userStakedAmount = await Promise.all(
    map(
      new Array(Number(userStakedTime)),
      async (_, i) =>
        await stakingContract.methods.userStakedAmount(account, i + 1).call(),
    ),
  );
  const userStakedStart = await Promise.all(
    map(
      new Array(Number(userStakedTime)),
      async (_, i) =>
        await stakingContract.methods.userStakedStart(account, i + 1).call(),
    ),
  );
  const userStakedPeriod = await Promise.all(
    map(
      new Array(Number(userStakedTime)),
      async (_, i) =>
        await stakingContract.methods.userStakedPeriod(account, i + 1).call(),
    ),
  );
  const singleReward = await Promise.all(
    map(
      new Array(Number(userStakedTime)),
      async (_, i) =>
        await stakingContract.methods.getSingleReward(account, i + 1).call(),
    ),
  );
  const status = await Promise.all(
    map(new Array(Number(userStakedTime)), async (_, i) => {
      const status: string = await stakingContract.methods
        .getLockedStatus(account, i + 1)
        .call();
      return Status[status];
    }),
  );
  const userReward = await stakingContract.methods.userReward(account).call();
  const claimable = await stakingContract.methods.getClaimable(account).call();
  const startStaking = await stakingContract.methods.startStaking().call();
  const endStaking = await stakingContract.methods.endStaking().call();
  const minDays = await stakingContract.methods.minDays().call();
  const maxDays = await stakingContract.methods.maxDays().call();
  const minMultiply = await stakingContract.methods.minMultiply().call();
  const maxMultiply = await stakingContract.methods.maxMultiply().call();
  const rewardVestingPeriod = await stakingContract.methods
    .rewardVestingPeriod()
    .call();
  const rewardPerYear = await stakingContract.methods.rewardPerYear().call();
  const startReward = await stakingContract.methods.startReward().call();
  const endReward = await stakingContract.methods.endReward().call();
  const totalWeightedStakedAmount = await stakingContract.methods
    .totalWeightedStakedAmount()
    .call();

  return {
    totalStakedAmount,
    userStakedTime,
    userTotalStakedAmount,
    userStakedAmount,
    userStakedStart,
    userStakedPeriod,
    singleReward,
    status,
    userReward,
    claimable,
    startStaking,
    endStaking,
    minDays,
    maxDays,
    minMultiply,
    maxMultiply,
    rewardVestingPeriod,
    rewardPerYear,
    startReward,
    endReward,
    totalWeightedStakedAmount,
  };
};

export const harvest = async (stakingContract: Contract, account: string) => {
  const gasPrice = await getGasPrice(stakingContract, 10000000000);
  const tx = stakingContract.methods
    .harvest()
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Staking harvested');
  } catch (err) {
    return false;
  }
  return true;
};

export const claimReward = async (
  stakingContract: Contract,
  account: string,
) => {
  const gasPrice = await getGasPrice(stakingContract, 10000000000);
  const tx = stakingContract.methods
    .claimReward()
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Claimed staking rewards');
  } catch (err) {
    return false;
  }
  return true;
};

export const withdraw = async (
  stakingContract: Contract,
  account: string,
  id: string,
) => {
  const gasPrice = await getGasPrice(stakingContract, 10000000000);
  const tx = stakingContract.methods
    .unlockStaking(id)
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Withdrawn staking');
  } catch (err) {
    return false;
  }
  return true;
};

export const getStageList = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/stages/stage_list/`,
  );
  return result.data;
};

export const getStageData = async (id: number) => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/stages/stage_data/${id}`,
  );
  return result.data;
};

export const getPlayStage = async () => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/stages/play_stage/`,
  );
  return result.data;
};

export const cancelStage = async () => {
  const result = await axios.put(
    `${process.env.REACT_APP_API_SERVER!}/stages/cancel_stage/`,
  );
  return result.data;
};

export const playStage = async (data: any) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_SERVER!}/stages/play_stage/`,
    data,
  );
  return result.data;
};

export const getPhaseData = async (id: number) => {
  const result = await axios(
    `${process.env.REACT_APP_API_SERVER!}/stages/phase_data/${id}`,
  );
  return result.data;
};

export const collect = async(claimRewardsContract: Contract, account: string) => {
  const gasPrice = await getGasPrice(claimRewardsContract, 10000000000);
  const tx = claimRewardsContract.methods
    .claim()
    .send({ from: account, gasPrice });
  try {
    await getToast(tx, 'Claimed rewards');
  } catch (err) {
    return false;
  }
  return true;
}
