import { MonoAirlineStops } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';

export interface IProps {
  value: string;
}

export const FormatMultiStepTx = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => {
    return value ? <MonoAirlineStops title="Multistep Tx" /> : undefined;
  };
  return Component;
};
