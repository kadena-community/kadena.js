import { shorten } from '@/utils/helpers';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

type IProps = Exclude<ICompactTableFormatterProps, 'value'> & {
  value: string;
};

export const FormatHash: () => FC<IProps> =
  () =>
  ({ value }) =>
    shorten(value);
