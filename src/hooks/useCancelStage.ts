import { useCallback } from 'react';
import { cancelStage } from 'utils/callHelpers';

const useCancelStage = () => {
  const handleCancel = useCallback(async () => {
    try {
      const result = await cancelStage();
      return result;
    } catch (e) {
      return false;
    }
  }, []);
  return {
    onCancelStage: handleCancel,
  };
};

export default useCancelStage;