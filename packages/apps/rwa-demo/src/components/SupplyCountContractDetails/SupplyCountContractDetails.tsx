import { useAsset } from '@/hooks/asset';

import type { FC } from 'react';
import React from 'react';
import { ContractDetails } from '../ContractDetails/ContractDetails';

export const SupplyCountContractDetails: FC = () => {
  const { asset } = useAsset();

  return (
    <ContractDetails label="Total token supply" value={asset?.supply ?? '-1'} />
  );
};
