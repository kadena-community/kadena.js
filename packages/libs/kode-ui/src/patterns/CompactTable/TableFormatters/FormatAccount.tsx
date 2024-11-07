import { maskValue } from './../../../components';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatAccount =
  () =>
  ({ value }: ICompactTableFormatterProps) =>
    value && maskValue(valueToString(value));
