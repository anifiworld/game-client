interface TransactionReceipt {
  transactionHash: string;
  events: {
    [key: string]: {
      raw: {
        data: string;
        topics: string[];
      };
      address: string;
    };
  };
}
