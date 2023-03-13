import { useCallback } from 'react';
import {
  getHeroList,
  getUserHeroList,
  getUserHeroOnChainList,
} from 'utils/callHelpers';

const useGetHeroList = () => {
  const handleGetHeroList = useCallback(async () => {
    try {
      const result = await getHeroList();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  const handleGetUserHeroList = useCallback(async () => {
    try {
      const result = await getUserHeroList();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  const handleGetUserHeroOnChainList = useCallback(async () => {
    try {
      const result = await getUserHeroOnChainList();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onGetHeroList: handleGetHeroList,
    onGetUserHeroList: handleGetUserHeroList,
    onGetUserHeroOnChainList: handleGetUserHeroOnChainList,
  };
};

export default useGetHeroList;