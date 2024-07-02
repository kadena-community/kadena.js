import type { NetworkInfo } from '@/__generated__/sdk';

/**
 * This function gets your numeric value and returns a string with the value and the unit (e.g. 1023 will be formatted to 1.02 K)
 * @param number Value to be formatted
 * @returns string value with unit
 */
export function formatNumberWithUnit(number: number): string {
  if (number === 0) {
    return `0`;
  }
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
  const formattedNumber = (number / Math.pow(1000, unitIndex)).toFixed(2);
  const unit = units[unitIndex] || '';
  const returnString = `${formattedNumber} ${unit}`;

  return returnString;
}

export function formatStatisticsData(
  networkInfo: NetworkInfo | null | undefined,
): { label: string; value: string }[] {
  if (!networkInfo) {
    return [
      { label: 'Est. Network Hash', value: '0 H/s' },
      { label: 'Total Difficulty', value: '0  H' },
      { label: 'Transactions', value: '0' },
      { label: 'Circulating Coins', value: '0' },
    ];
  }

  return [
    {
      label: 'Est. Network Hash',
      value: `${formatNumberWithUnit(networkInfo.networkHashRate)}H/s`,
    },
    {
      label: 'Total Difficulty',
      value: `${formatNumberWithUnit(networkInfo.totalDifficulty)}H`,
    },
    {
      label: 'Transactions',
      value: formatNumberWithUnit(networkInfo.transactionCount),
    },
    {
      label: 'Circulating Coins',
      value: formatNumberWithUnit(networkInfo.coinsInCirculation),
    },
  ];
}

export function truncateValues(
  value: string = '',
  options?: { length?: number; startChars?: number; endChars?: number },
): string {
  // Default size if only size is given or not provided
  const defaultSize = 18;

  // If size is not provided, set to defaultSize
  const minLength = options?.length ?? defaultSize;

  // if no startChars or endChars, and it's smaller than default or given length
  if (
    (!options || !options.startChars || !options.endChars) &&
    value.length <= minLength
  ) {
    return value;
  }

  // if startChars and endChars are not provided
  if (!options || (options && !options.startChars && !options.endChars)) {
    return `${value.slice(0, minLength)}…`;
  }

  // if endChars is provided
  if (options && !options.startChars && options.endChars) {
    return `${value.slice(0, minLength - options.endChars)}…${value.slice(
      value.length - options.endChars,
    )}`;
  }

  // if startChars and endChars are provided
  if (options && options.startChars && options.endChars) {
    // no reason to truncate if the options are longer than the value length
    if (options.startChars + options.endChars >= value.length) {
      return value;
    }

    return `${value.slice(0, options.startChars)}…${value.slice(
      value.length - options.endChars,
    )}`;
  }

  // if only startChars is given
  if (options && options.startChars && !options.endChars) {
    return `${value.slice(0, options.startChars)}…${value.slice(
      -(minLength - options.startChars),
    )}`;
  }

  return value; // fallback in case none of the conditions match
}
