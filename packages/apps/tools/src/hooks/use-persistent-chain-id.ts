import { type ChainwebChainId } from '@kadena/chainweb-node-client';

import { type OnChainSelectChange } from '@/components/Global';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useCallback } from 'react';

const usePersistentChainID = (): [ChainwebChainId, OnChainSelectChange] => {
  const { selectedChain, setSelectedChain } = useWalletConnectClient();
  const onChainSelectChange = useCallback<OnChainSelectChange>(
    (selectedChain) => {
      setSelectedChain(selectedChain);
    },
    [setSelectedChain],
  );
  return [selectedChain, onChainSelectChange];
};

export default usePersistentChainID;
