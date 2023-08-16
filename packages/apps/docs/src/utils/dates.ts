import {
  addMonths,
  compareDesc as compareDescFns,
  format,
  formatDistance,
  isFuture,
  isToday,
  isValid,
  isYesterday,
} from 'date-fns';

export const getOneMonthAgo = (date: Date): Date => {
  return addMonths(date, -1);
};

export const formatISODate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const compareDesc = (dateLeft?: string, dateRight?: string): number => {
  if (dateLeft === undefined || dateRight === undefined) {
    throw new Error(`invalid date compare with undefined dates`);
  }
  const left = new Date(dateLeft);
  const right = new Date(dateRight);

  if (!isValid(left) || !isValid(right)) {
    throw new Error(`invalid date compare: ${dateLeft} : ${dateRight} `);
  }
  return compareDescFns(left, right);
};

export const formatDateDistance = (date: Date): string => {
  if (!isValid(date)) {
    throw new Error(`invalid date: ${date}`);
  }

  const today = new Date();

  if (isToday(date) || isFuture(date)) {
    return 'today';
  }
  if (isYesterday(date)) {
    return 'yesterday';
  }

  return `${formatDistance(date, today)} ago`;
};
