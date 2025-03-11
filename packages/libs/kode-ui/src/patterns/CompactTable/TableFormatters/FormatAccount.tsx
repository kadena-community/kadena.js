import React from 'react';
import { maskValue, Text } from './../../../components';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (!value) return null;
    return <Text variant="code">{maskValue(valueToString(value))}</Text>;
  };

  return Component;
};
