import { useCallback } from 'react';
import { getGemSlots, updateGemSlots } from 'utils/callHelpers';


const useGetGemSlots = () => {
  const handleGetGemSlots = useCallback(async (id: string) => {
    try {
      const result = await getGemSlots(id);
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  const handleUpdateGemSlots = useCallback(
    async (id: string, gemList: { [key: string]: string }) => {
      try {
        const result = await updateGemSlots(id, gemList);
        return result;
      } catch (e) {
        return false;
      }
    },
    [],
  );
  return {
    onGetGemSlots: handleGetGemSlots,
    onUpdateGemSlots: handleUpdateGemSlots,
  };
};

export default useGetGemSlots;