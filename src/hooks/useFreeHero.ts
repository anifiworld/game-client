import { useCallback } from 'react';
import { getFreeHero } from 'utils/callHelpers';


const useFreeHero = () => {
  const handleGetFreeHero = useCallback(async (data: any) => {
    try {
      const result = await getFreeHero(data);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetFreeHero: handleGetFreeHero,
  };
};

export default useFreeHero;