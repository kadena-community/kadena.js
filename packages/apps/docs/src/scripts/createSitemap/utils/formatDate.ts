import { format, isValid } from 'date-fns';

export const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  if (!isValid(date)) return '';

  return format(date, 'yyyy-MM-dd');
};
