import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';

export const getOneMonthAgo = (date: Date): Date => {
  return addMonths(date, -1);
};

export const formatISODate = (date: Date): string => format(date, 'yyyy-MM-dd');
