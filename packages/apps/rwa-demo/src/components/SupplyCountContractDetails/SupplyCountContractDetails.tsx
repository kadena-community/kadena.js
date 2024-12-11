import { useAsset } from '@/hooks/asset';
import type { FC } from 'react';

export const SupplyCountContractDetails: FC = () => {
  const { asset } = useAsset();

  return asset?.supply;
};
