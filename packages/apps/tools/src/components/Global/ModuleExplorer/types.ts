import type { Network } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';

export interface IChainModule {
  code?: string;
  chainId: ChainwebChainId;
  moduleName: string;
  hash?: string;
  network: Network;
}

export interface IModule {
  moduleName: string;
  chains: ChainwebChainId[];
}
