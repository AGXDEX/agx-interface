import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

const isContractAddress = (address: string) => ethers.utils.isAddress(address);

const displayAddress = (address = '', startOffset = 4, endOffset = 4): string => {
  if (!address) return '--';
  if (!isContractAddress(address)) {
    if (address.length <= startOffset + endOffset) return address;
    return `${address.slice(0, startOffset)}...`;
  }

  return `${address.slice(0, startOffset)}...${address.slice(-endOffset)}`;
};

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

export const shortenValueWithSuffix = ({
  value,
  outputsDollars = false,
}: {
  value: BigNumber;
  outputsDollars?: boolean;
}) => {
  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    return `${value.dividedBy(ONE_BILLION).toFormat(2)}B`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    return `${value.dividedBy(ONE_MILLION).toFormat(2)}M`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    return `${value.dividedBy(ONE_THOUSAND).toFormat(2)}K`;
  }

  if (value.isGreaterThanOrEqualTo(1)) {
    return value.toFormat(2);
  }

  if (value.isEqualTo(0) && !outputsDollars) {
    return '0';
  }

  return value.toFormat(outputsDollars ? 2 : 8);
};

const formatNumberWithCommas = (v: string) => {
  const parts = v.split('.');
  const value = parts[0].replace(/\D/g, '');
  const decimal = parts[1];

  let formattedValue = new Intl.NumberFormat('en-EN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(+value);

  if (!isNaN(+decimal)) {
    formattedValue = `${formattedValue}.${decimal}`;
  }
  return formattedValue;
};

const displayFloat = (value: number, decimals = 4, isCurrency?: boolean, isRoundUp = false) => {
  if (Number.isNaN(value)) return '0.0';
  if (value === 0) return '0.0';

  const formattedValue = isRoundUp ? value : Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  const formattedString = formattedValue.toFixed(decimals);

  return value === undefined ? '0.0' : isCurrency ? `$${formattedString}` : formattedString;
};

export { displayAddress, formatNumberWithCommas, displayFloat };
