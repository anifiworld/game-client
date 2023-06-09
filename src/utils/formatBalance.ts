import BigNumber from 'bignumber.js';

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(
    new BigNumber(10).pow(decimals),
  );
  return displayBalance.toNumber();
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const getDisplayPayout = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals));
};

export const formatNumber = (
  number: number,
  minPrecision = 2,
  maxPrecision = 2,
) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return number.toLocaleString(undefined, options);
};

export function formatCommaSeparated(x: string | number) {
  x = x.toString();
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, '$1,$2');
  return x;
  // const regExp = new RegExp('\\B(?<!\\.\\d*)(?=(\\d{3})+(?!\\d))', 'g');
  // return x.toString().replace(regExp, ',');
}
