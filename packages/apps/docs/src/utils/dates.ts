import {
  addMonths,
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
