import { useCallback } from 'react';
import { getHeroTypes } from 'utils/callHelpers';


const useGetHeroTypes = () => {
  const handleGetHeroTypes = useCallback(async () => {
    try {
      const result = await getHeroTypes();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetHeroTypes: handleGetHeroTypes,
  };
};

export default useGetHeroTypes;