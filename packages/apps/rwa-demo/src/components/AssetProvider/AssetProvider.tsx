'use client';
import { useNetwork } from '@/hooks/networks';
import { isPaused } from '@/services/isPaused';
import { paused } from '@/services/paused';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

interface IAsset {
  name: string;
}

export interface IAssetContext {
  asset?: IAsset;
  isPaused: boolean;
}

export const AssetContext = createContext<IAssetContext>({
  isPaused: false,
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();
  const { activeNetwork } = useNetwork();
  const [isPaused, setIsPaused] = useState(false);

  const checkIsPaused = async () => {
    const res = await paused(activeNetwork);
    setIsPaused(!!res);
  };

  useEffect(() => {
    if (!asset) {
      setIsPaused(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkIsPaused();
  }, [asset]);

  return (
    <AssetContext.Provider value={{ asset, isPaused }}>
      {children}
    </AssetContext.Provider>
  );
};
