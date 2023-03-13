import { useCallback } from 'react';
import { getPhaseData } from 'utils/callHelpers';

const useGetPhaseData = () => {
  const handleGetPhaseData = useCallback(async (id: number) => {
    try {
      const result = await getPhaseData(id);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetPhaseData: handleGetPhaseData,
  };
};

export default useGetPhaseData;