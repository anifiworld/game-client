import { useCallback } from 'react';
import { getUserGemList } from 'utils/callHelpers';


const useGetUserGemList = () => {
  const handleGetUserGemList = useCallback(async () => {
    try {
      const result = await getUserGemList();
      return result;
    } catch (e) {
      return false;
    }
  }, []);

  return {
    onGetUserGemList: handleGetUserGemList,
  };
};

export default useGetUserGemList;