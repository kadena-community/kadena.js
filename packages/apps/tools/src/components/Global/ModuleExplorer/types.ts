import type { Network } from '@/constants/kadena';
import type { IncompleteModuleModel } from '@/hooks/use-module-query';
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

export type Outline =
  | string
  | ContractInterface
  | ContractCapability
  | ContractFunction;

export const isModule = (
  item: IncompleteModuleModel | Outline,
): item is IncompleteModuleModel => {
  return (
    typeof item !== 'string' &&
    (item as IncompleteModuleModel).chainId !== undefined &&
    (item as IncompleteModuleModel).name !== undefined &&
    (item as IncompleteModuleModel).networkId !== undefined
  );
};
