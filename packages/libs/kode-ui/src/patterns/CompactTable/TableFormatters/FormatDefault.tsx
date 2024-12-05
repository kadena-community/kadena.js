import React from 'react';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatDefault = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return <>{valueToString(value)}</>;
  };
  return Component;
};
