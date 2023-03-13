export const setupNetwork = async () => {
  const provider = (window as WindowChain).ethereum;
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID!, 10);
    try {
      await provider.request!({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'BNB Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: [process.env.REACT_APP_NODE],
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      });
      return true;
    } catch (error) {
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined",
    );
    return false;
  }
};

export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  let ethereum = (window as WindowChain).ethereum;
  if (!ethereum || !ethereum.request) return null;
  const tokenAdded = await ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};
