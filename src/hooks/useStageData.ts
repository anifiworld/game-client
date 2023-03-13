import { useCallback } from 'react';
import { getStageData } from 'utils/callHelpers';

const useGetStateData = () => {
  const handleGetStageData = useCallback(async (id: number) => {
    try {
      const result = await getStageData(id);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetStageData: handleGetStageData,
  };
};

export default useGetStateData;