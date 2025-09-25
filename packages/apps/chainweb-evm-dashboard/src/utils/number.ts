import { GraphChartData } from "../store/chain/type";

export const intl = new Intl.NumberFormat('en-US');

export const __n = (num: number): string => {
  return intl.format(num);
};

export const _n = (num: number): string => {
  const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' });
  return compactFormatter.formatToParts(num)
    .map(part => part.value)
    .join('');
};

export const toPrecision = (num: number, digits: number): string => {
  return num.toPrecision(digits);
};

export const toFixed = (num: number, digits: number): string => {
  return num.toFixed(digits);
};

export const toRounded = (num: number): string => {
  return Math.round(num).toString();
};

export const toPercentage = (num: number, digits: number): string => {
  return (num * 100).toFixed(digits) + '%';
};

export const toNumber = (str: string | number): number => {
  if (typeof str === 'number') {
    return str;
  }

  if (str === '' || isNaN(Number(str))) {
    return NaN;
  }

  return Number(str);
};

export const getMaxNumberStatsDataList = (data?: Array<GraphChartData>): number => {
  if (!data || !data.length) {
    return 0;
  }

  return Math.max(...data.map(d => Number(d.value))) || 0;
};
