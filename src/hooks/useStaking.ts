import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  claimReward,
  enterStaking,
  getStakingData,
  harvest,
  withdraw,
} from 'utils/callHelpers';

dayjs.extend(duration);

const useStaking = () => {
  const { account } = useWeb3React();
  const handleEnterStaking = useCallback(
    async (stakingContract: any, amount: number, period: number) => {
      try {
        const result = await enterStaking(
          stakingContract,
          account!,
          new BigNumber(amount * 10 ** 18),
          dayjs.duration(period * 24 * 60 * 60).asMilliseconds(),
        );
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleGetStakingData = useCallback(
    async (stakingContract: any) => {
      try {
        const result = await getStakingData(stakingContract, account!);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleHarvest = useCallback(
    async (stakingContract: any) => {
      try {
        const result = await harvest(stakingContract, account!);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleClaimReward = useCallback(
    async (stakingContract: any) => {
      try {
        const result = await claimReward(stakingContract, account!);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  const handleWithdraw = useCallback(
    async (stakingContract: any, id: string) => {
      try {
        const result = await withdraw(stakingContract, account!, id);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  return {
    onEnterStaking: handleEnterStaking,
    onGetStakingData: handleGetStakingData,
    onHarvest: handleHarvest,
    onClaimReward: handleClaimReward,
    onWithdraw: handleWithdraw,
  };
};

export default useStaking;
