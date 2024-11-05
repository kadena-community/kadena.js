import { shorten } from '@/utils/helpers';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const FormatHash: () => FC<ICompactTableFormatterProps> =
  () =>
  ({ value }) =>
    shorten(value);
