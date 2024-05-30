import type { Network } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type {
  ContractCapability,
  ContractFunction,
  ContractInterface,
} from './utils';

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

export type ElementType<T> = T extends (infer U)[] ? U : never;

export type Outline =
  | string
  | ContractInterface
  | ContractCapability
  | ContractFunction;
