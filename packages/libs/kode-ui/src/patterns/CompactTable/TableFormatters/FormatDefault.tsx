import type { FC } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatDefault = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => (
    <>{value}</>
  );
  return Component;
};
