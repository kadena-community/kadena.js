import { MonoCheck, MonoClear } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatStatus = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) =>
    value ? <MonoCheck /> : <MonoClear />;
  return Component;
};
