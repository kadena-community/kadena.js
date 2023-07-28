import { type ChainwebChainId } from '@kadena/chainweb-node-client';

import { type OnChainSelectChange } from '@/components/Global';
import { useAppContext } from '@/context/app-context';
import { useCallback } from 'react';

const usePersistentChainID = (): [ChainwebChainId, OnChainSelectChange] => {
  const { chainID, setChainID } = useAppContext();
  const onChainSelectChange = useCallback<OnChainSelectChange>(
    (chainID) => {
      setChainID(chainID);
    },
    [setChainID],
  );
  return [chainID, onChainSelectChange];
};

export default usePersistentChainID;
