import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import { useEffect, useState } from 'react';

const defaultChains = 20;

export const useChains = (networkId: string) => {
  const [chains, setChains] = useState<ChainId[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const chainList = await walletSdk.getChains(networkId);
        setChains(
          chainList.length > 0
            ? chainList.map((chain) => chain.id as ChainId)
            : Array.from(
                { length: defaultChains },
                (_, i) => `${i}` as ChainId,
              ),
        );
      } catch (e) {
        setError(e as Error);
        setChains(
          Array.from({ length: defaultChains }, (_, i) => `${i}` as ChainId),
        );
      }
    };
    fetchChains();
  }, [networkId]);

  return { chains, error };
};
