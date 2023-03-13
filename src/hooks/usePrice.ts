import { getItemPrice } from 'utils/callHelpers';

const usePrice = () => {
  const handleGetPrice = async (vendorContract: any, id: string) => {
    try {
      const result = await getItemPrice(vendorContract, id);
      return result;
    } catch (e) {
      return false;
    }
  };
  return {
    onGetPrice: handleGetPrice,
  };
};

export default usePrice;
