import type { IAssetContext } from '@/components/AssetProvider/AssetProvider';
import { AssetContext } from '@/components/AssetProvider/AssetProvider';

import { useContext } from 'react';

export const useAsset = (): IAssetContext => useContext(AssetContext);
