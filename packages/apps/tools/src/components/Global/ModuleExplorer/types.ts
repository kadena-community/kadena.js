import type { Network } from '@/constants/kadena';
import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
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

export const isModuleLike = (
  item: IncompleteModuleModel | Outline,
): item is IncompleteModuleModel => {
  return (
    typeof item !== 'string' &&
    (item as IncompleteModuleModel).chainId !== undefined &&
    (item as IncompleteModuleModel).name !== undefined &&
    (item as IncompleteModuleModel).networkId !== undefined
  );
};

export const isCompleteModule = (
  item: IncompleteModuleModel | Outline,
): item is ModuleModel => {
  return isModuleLike(item) && item.code !== undefined;
};
