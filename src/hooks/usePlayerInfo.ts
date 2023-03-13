import { useCallback } from 'react';
import { getPlayerInfo } from 'utils/callHelpers';


const useGetPlayerInfo = () => {
  const handleGetPlayerInfo = useCallback(async () => {
    try {
      const result = await getPlayerInfo();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetPlayerInfo: handleGetPlayerInfo,
  };
};

export default useGetPlayerInfo;