import { useAsset } from '@/hooks/asset';

import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

export const SupplyCount: FC = () => {
  const { asset } = useAsset();

  return <Stack>total supply: {asset?.supply}</Stack>;
};
