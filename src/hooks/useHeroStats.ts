import { heroStats } from 'utils/callHelpers';

const useHeroStats = () => {
  const handleHeroStats = async (heroContract: any, id: string) => {
    try {
      const result = await heroStats(heroContract, id);
      return result;
    } catch (e) {
      return false;
    }
  };
  return {
    onHeroStats: handleHeroStats,
  };
};

export default useHeroStats;
