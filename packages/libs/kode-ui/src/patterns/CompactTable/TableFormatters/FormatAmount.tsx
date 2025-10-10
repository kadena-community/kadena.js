import React from 'react';
import { token } from './../../../styles';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatAmount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (value === undefined || value === null) return null;
    return (
      <>
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            marginInlineEnd: token('spacing.sm'),
          }}
        >
          {parseFloat(valueToString(value)).toLocaleString()}
        </span>{' '}
        KDA
      </>
    );
  };
  return Component;
};
