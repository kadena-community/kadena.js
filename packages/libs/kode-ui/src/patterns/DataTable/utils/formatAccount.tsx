import type { FC } from 'react';
import { maskValue } from './../../../components';

interface IProps {
  value: string;
}

export const FormatAccount: () => FC<IProps> =
  () =>
  ({ value }) =>
    value && maskValue(value);
