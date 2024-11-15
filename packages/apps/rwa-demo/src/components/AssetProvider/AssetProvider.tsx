'use client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

interface IAsset {
  name: string;
}

export interface IAssetContext {
  asset?: IAsset;
}

export const AssetContext = createContext<IAssetContext>({});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();

  return (
    <AssetContext.Provider value={{ asset }}>{children}</AssetContext.Provider>
  );
};
