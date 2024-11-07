import { MonoAirlineStops } from '@kadena/kode-icons/system';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatMultiStepTx = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return valueToString(value) ? (
      <MonoAirlineStops title="Multistep Tx" />
    ) : undefined;
  };
  return Component;
};
