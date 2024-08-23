import { MonoAirlineStops } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  value: string;
}

export const formatXChainTX = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => {
    return value ? <MonoAirlineStops /> : undefined;
  };
  return Component;
};
