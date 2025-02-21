import {
  DefaultValues,
  useWalletConnectClient,
} from '@/context/connect-wallet-context';
import { getHighestBalanceChainId } from '@/services/chains/get-highest-balance-chain-id';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { useLayoutEffect, useState } from 'react';

const useHighestBalanceChainId = () => {
  const { selectedNetwork, networksData } = useWalletConnectClient();
  const [chainID, setChainId] = useState<ChainwebChainId>(
    DefaultValues.CHAIN_ID,
  );

  const init = async () => {
    const data = await getHighestBalanceChainId({
      selectedNetwork,
      networksData,
    });

    if (!data) return;

    setChainId(data?.chainId);
  };

  useLayoutEffect(() => {
    console.log({ selectedNetwork });
    if (selectedNetwork !== 'testnet04') return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [selectedNetwork]);

  return { chainID, onChainSelectChange: setChainId };
};

export default useHighestBalanceChainId;
