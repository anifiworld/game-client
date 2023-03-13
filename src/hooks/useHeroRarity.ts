import { heroRarity } from 'utils/callHelpers';

const useHeroRarity = () => {
  const handleHeroRarity = async (utilsContract: any, id: string) => {
    try {
      const result = await heroRarity(utilsContract, id);
      return result;
    } catch (e) {
      return false;
    }
  };
  return {
    onHeroRarity: handleHeroRarity,
  };
};

export default useHeroRarity;
