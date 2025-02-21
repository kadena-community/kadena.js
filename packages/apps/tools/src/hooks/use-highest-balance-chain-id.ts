import {
  DefaultValues,
  useWalletConnectClient,
} from '@/context/connect-wallet-context';
import { getHighestBalanceChainId } from '@/services/chains/get-highest-balance-chain-id';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { useEffect, useState } from 'react';

const useHighestBalanceChainId = () => {
  const { selectedNetwork, networksData } = useWalletConnectClient();
  const [chainID, setChainId] = useState<ChainwebChainId>(
    DefaultValues.CHAIN_ID,
  );
  const [isMounted, setIsMounted] = useState(false);

  const init = async () => {
    const data = await getHighestBalanceChainId({
      selectedNetwork,
      networksData,
    });

    setIsMounted(true);
    if (!data) return;

    setChainId(data?.chainId);
  };

  useEffect(() => {
    if (selectedNetwork !== 'testnet04') {
      setIsMounted(true);
      return;
    }

    setIsMounted(false);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork]);

  return { chainID, onChainSelectChange: setChainId, isMounted };
};

export default useHighestBalanceChainId;
