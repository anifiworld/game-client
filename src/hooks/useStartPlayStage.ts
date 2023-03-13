import { useCallback } from 'react';
import { playStage } from 'utils/callHelpers';

const useStartPlayStage = () => {
  const handleStartPlayStage = useCallback(
    async (data: any) => {
      try {
        const result = await playStage(data);
        return result;
      } catch (e) {
        return false;
      }
    },
    [],
  );
  return {
    onStartPlayStage: handleStartPlayStage,
  };
};

export default useStartPlayStage;