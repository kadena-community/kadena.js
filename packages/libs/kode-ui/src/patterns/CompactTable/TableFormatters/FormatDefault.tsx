import type { FC } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatDefault = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => {
    if (typeof value === 'object') {
      return value.reduce((acc, val) => {
        if (!val) return acc;
        return `${acc}${val} `;
      }, '');
    }

    return <>{value}</>;
  };
  return Component;
};
