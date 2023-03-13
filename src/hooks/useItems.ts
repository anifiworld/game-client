import { useCallback } from 'react';
import { getItems } from '../utils/callHelpers';


const useItems = () => {
  const handleItems = useCallback(async () => {
    try {
      const result = await getItems();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return { onItems: handleItems };
};

export default useItems;