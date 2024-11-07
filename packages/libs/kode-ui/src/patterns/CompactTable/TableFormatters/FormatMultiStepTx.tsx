import { MonoAirlineStops } from '@kadena/kode-icons/system';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatMultiStepTx = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return value ? <MonoAirlineStops title="Multistep Tx" /> : undefined;
  };
  return Component;
};
