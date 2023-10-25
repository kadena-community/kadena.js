import type { ChainwebChainId } from '@kadena/chainweb-node-client';

export interface IChainModule {
  code?: string;
  chainId: ChainwebChainId;
  moduleName: string;
  hash?: string;
}

export interface IModule {
  moduleName: string;
  chains: ChainwebChainId[];
}
