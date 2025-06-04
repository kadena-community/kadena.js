import type { IAssetContext } from '@/contexts/AssetContext/AssetContext';
import { AssetContext } from '@/contexts/AssetContext/AssetContext';
import { useContext } from 'react';

export const useAsset = (): IAssetContext => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within a AssetContextProvider');
  }
  return context;
};
