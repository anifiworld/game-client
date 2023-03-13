import { useCallback } from 'react';
import { getStageList } from 'utils/callHelpers';

const useGetStageList = () => {
  const handleGetStageList = useCallback(async () => {
    try {
      const result = await getStageList();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetStageList: handleGetStageList,
  };
};

export default useGetStageList;