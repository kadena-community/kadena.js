import { maskValue } from '@kadena/react-ui';
import type { FC } from 'react';

interface IProps {
  value: string;
}

export const FormatAccount: () => FC<IProps> =
  () =>
  ({ value }) =>
    value && maskValue(value);
