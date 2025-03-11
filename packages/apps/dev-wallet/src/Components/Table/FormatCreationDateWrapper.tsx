import { toISOLocalDateTime } from '@/utils/helpers';

export const FormatCreationDateWrapper =
  () =>
  ({ value }: { value: string | string[] }) => {
    const times =
      typeof value === 'string' || typeof value === 'number' ? [value] : value;
    return times.map((time) => toISOLocalDateTime(+time * 1000)).join('\n');
  };
