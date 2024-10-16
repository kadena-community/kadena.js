import type { FC } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatAmount = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => (
    <>{value} KDA</>
  );
  return Component;
};
