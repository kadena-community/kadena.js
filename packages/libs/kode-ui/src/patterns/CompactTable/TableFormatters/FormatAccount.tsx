import type { FC } from 'react';
import { maskValue } from './../../../components';
import type { ICompactTableFormatterProps } from './types';

export const FormatAccount: () => FC<ICompactTableFormatterProps> =
  () =>
  ({ value }) =>
    value && maskValue(value);
