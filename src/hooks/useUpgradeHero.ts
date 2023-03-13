import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { upgradeHero } from 'utils/callHelpers';

const useUpgradeHero = () => {
  const { account } = useWeb3React();
  const handleUpgradeHero = useCallback(
    async (heroContract: any, id: string) => {
      try {
        const result = await upgradeHero(heroContract, account!, id);
        return result;
      } catch (e) {
        return false;
      }
    },
    [account],
  );
  return {
    onUpgradeHero: handleUpgradeHero,
  };
};

export default useUpgradeHero;
