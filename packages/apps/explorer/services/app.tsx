import { createContext, useCallback, useEffect, useState } from 'react';
import { NodeInfoResponseData } from 'network/info';
import uniqBy from 'lodash/uniqBy';
import { BlockDetail, NetworkName } from '../utils/api';
import { hasWindow } from '../utils/window';
import { setNetworkCookie } from '../utils/cookie';
import { useRecentUpdates } from './api';

export const NetworkContext = createContext<{
  network: NetworkName;
  setNetwork: (network: NetworkName) => void;
}>({
  network: NetworkName.MAIN_NETWORK,
  setNetwork: () => {},
});

export const useNetworkState = (network: NetworkName) => {
  const [networkState, setNetworkState] = useState<NetworkName>(network);

  useEffect(() => {
    if (hasWindow) {
      if (networkState) {
        setNetworkCookie(networkState);
      }
    }
  }, [networkState]);

  return {
    network: networkState,
    setNetwork: setNetworkState,
  };
};

export const BlocksContext = createContext<{
  blocks: BlockDetail[];
}>({
  blocks: [],
});

export const useBlocksState = (
  network: NetworkName,
  nodeInfo: NodeInfoResponseData | null | undefined,
) => {
  const [blocksState, setBlocksState] = useState<BlockDetail[]>([]);

  const onNewBlock = useCallback((block: BlockDetail) => {
    setBlocksState(oldBlocks => {
      const newBlocks = [block, ...oldBlocks];
      return uniqBy(newBlocks, (item: BlockDetail) =>
        [item.chainId, item.height].join(),
      ).slice(0, 80);
    });
  }, []);
  useRecentUpdates(network, nodeInfo, onNewBlock);

  return {
    blocks: blocksState,
  };
};
