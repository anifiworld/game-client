import { getHeroType } from 'utils/callHelpers';

const useUtils = () => {
  const handleGetHeroType = async (utilsContract: any, heroId: string) => {
    try {
      const result = await getHeroType(utilsContract, heroId);
      return result;
    } catch (e) {
      return false;
    }
  };

  return {
    onHeroType: handleGetHeroType,
  };
};

export default useUtils;
