import type { NetworkInfo } from '@/__generated__/sdk';

export function formatNumberWithUnit(number: number, unit?: string): string {
  if (number === 0) {
    return `0 ${unit === undefined ? unit : ''}`;
  }
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
  const formattedNumber = (number / Math.pow(1000, unitIndex)).toFixed(2);
  return `${formattedNumber} ${units[unitIndex]}${unit === undefined ? unit : ''}`;
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
      value: formatNumberWithUnit(networkInfo.networkHashRate, 'H/s'),
    },
    {
      label: 'Total Difficulty',
      value: formatNumberWithUnit(networkInfo.totalDifficulty, 'H'),
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
  value?: string,
  minLength: number = 15,
  startChars: number = 5,
  endChars: number = 4,
): string {
  if (!value) return '';
  if (value.length > minLength) {
    return `${value.slice(0, startChars)}...${value.slice(-endChars)}`;
  }
  return value;
}
