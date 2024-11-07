import React from 'react';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatAmount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (!value) return null;
    return <>{parseFloat(valueToString(value)).toLocaleString()} KDA</>;
  };
  return Component;
};
