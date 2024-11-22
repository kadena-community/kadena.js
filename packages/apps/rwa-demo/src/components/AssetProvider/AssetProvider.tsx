'use client';
import { usePaused } from '@/hooks/paused';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

interface IAsset {
  name: string;
}

export interface IAssetContext {
  asset?: IAsset;
  paused: boolean;
}

export const AssetContext = createContext<IAssetContext>({
  paused: true,
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();
  const { paused } = usePaused();

  return (
    <AssetContext.Provider value={{ asset, paused }}>
      {children}
    </AssetContext.Provider>
  );
};
