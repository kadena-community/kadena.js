import React from 'react';
import type { MaskOptions } from './../../../components';
import { maskValue, Text } from './../../../components';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatAccount = (options?: Partial<MaskOptions>) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (!value) return null;
    return (
      <Text variant="code">{maskValue(valueToString(value), options)}</Text>
    );
  };

  return Component;
};
