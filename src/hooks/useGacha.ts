import { filter, map } from 'lodash';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { claimGacha, finishedRandom, requestingGacha } from 'utils/callHelpers';


const useGacha = (vendorContract: any) => {
  const { account } = useWeb3React();
  const handleRequestingGacha = useCallback(async () => {
    try {
      const result = await requestingGacha(vendorContract, account!);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  const handleFinishedRandom = useCallback(async () => {
    try {
      const result = await finishedRandom(vendorContract, account!);
      return result;
    } catch (e) {
      return false;
    }
  }, []);

  const handleClaimGacha = useCallback(async () => {
    try {
      const result = await claimGacha(vendorContract, account!);
      const gachaIds = map(
        filter(result.events, ({ raw: { data } }) => data.length === 130),
        ({ raw: { data } }) => data.split('0x')[1].slice(0, 64),
      );
      return gachaIds;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onRequestingGacha: handleRequestingGacha,
    onFinishedRandom: handleFinishedRandom,
    onClaimGacha: handleClaimGacha,
  };
};

export default useGacha;