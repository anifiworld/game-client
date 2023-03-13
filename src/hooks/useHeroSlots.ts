import { useCallback } from 'react';
import { getHeroSlots } from 'utils/callHelpers';


const useGetHeroSlots = () => {
  const handleGetHeroSlots = useCallback(async () => {
    try {
      const result = await getHeroSlots();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetHeroSlots: handleGetHeroSlots,
  };
};

export default useGetHeroSlots;