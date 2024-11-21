import { useSupply } from '@/hooks/supply';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

export const SupplyCount: FC = () => {
  const { data } = useSupply();

  return <Stack>total supply: {data}</Stack>;
};
