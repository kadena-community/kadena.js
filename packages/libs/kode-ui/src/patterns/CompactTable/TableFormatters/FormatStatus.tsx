import { MonoCheck, MonoClear } from '@kadena/kode-icons/system';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatStatus = () => {
  const Component = ({ value }: ICompactTableFormatterProps) =>
    valueToString(value) ? <MonoCheck /> : <MonoClear />;
  return Component;
};
