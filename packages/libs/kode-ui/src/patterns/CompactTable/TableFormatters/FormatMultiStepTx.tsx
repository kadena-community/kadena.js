import { MonoAirlineStops } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatMultiStepTx = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => {
    return value ? <MonoAirlineStops title="Multistep Tx" /> : undefined;
  };
  return Component;
};
