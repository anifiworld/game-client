import { useCallback } from 'react';
import { getPlayStage } from 'utils/callHelpers';

const useGetPlayStage = () => {
  const handleGetPlayStage = useCallback(async () => {
    try {
      const result = await getPlayStage();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetPlayStage: handleGetPlayStage,
  };
};

export default useGetPlayStage;