import { useCallback } from 'react';
import { upDateHeroSlots } from 'utils/callHelpers';


const useUpdateHeroSlots = () => {
  const handleUpdateHeroSlots = useCallback(
    async (ids: string[] | undefined) => {
      try {
        const result = await upDateHeroSlots(ids);
        return result;
      } catch (e) {
        return false;
      }
    },
    [],
  );
  return {
    onUpdateHeroSlots: handleUpdateHeroSlots,
  };
};

export default useUpdateHeroSlots;