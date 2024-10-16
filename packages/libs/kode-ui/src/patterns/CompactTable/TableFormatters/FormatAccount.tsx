import type { FC } from 'react';
import { maskValue } from './../../../components';

export interface IProps {
  value: string;
}

export const FormatAccount: () => FC<IProps> =
  () =>
  ({ value }) =>
    value && maskValue(value);
