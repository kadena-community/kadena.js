import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import type { ElementType } from '@/types/utils';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { contractParser } from '@kadena/pactjs-generator';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { IChainModule, Outline } from './types';

export type Contract = ReturnType<typeof contractParser>[0][0]; // TODO: Should we improve this because it's a bit hacky?
export type ContractInterface = ElementType<Contract['usedInterface']> & {
  code?: string;
  chainId: ChainwebChainId;
  networkId: ChainwebNetworkId;
};
export type ContractCapability = ElementType<Contract['capabilities']>;
export type ContractFunction = ElementType<Contract['functions']>;

export const chainModuleToOutlineTreeItems = (
  chainModule: IChainModule,
  items: TreeItem<IncompleteModuleModel>[],
): TreeItem<Outline>[] => {
  const treeItems: TreeItem<Outline>[] = [];

  if (!chainModule.code) {
    return treeItems;
  }

  const [, namespace] = chainModule.moduleName.split('.');
  const [[parsedContract]] = contractParser(chainModule.code, namespace);

  const { usedInterface: interfaces, capabilities, functions } = parsedContract;

  if (interfaces?.length) {
    treeItems.push({
      title: 'Interfaces',
      key: 'interfaces',
      data: {
        name: 'interfaces',
        chainId: chainModule.chainId,
        networkId: chainModule.network as ChainwebNetworkId,
      },
      children: interfaces.map((i) => {
        // Top level, one of the networks
        const networkItems = items.find((item) => {
          return item.data.networkId === chainModule.network;
        });
        // The second level, the module on certain chains
        const chainModules = networkItems?.children.find((child) => {
          return child.data.name === i.name;
        });
        // And now the final search, the module on the specific chain
        const moduleTreeItem = chainModules?.children.find((child) => {
          return child.data.chainId === chainModule.chainId;
        });

        return {
          title: i.name,
          key: `${chainModule.network}.${i.name}`,
          label: moduleTreeItem?.data.hash,
          data: {
            ...i,
            chainId: chainModule.chainId,
            networkId: chainModule.network as ChainwebNetworkId,
            code: moduleTreeItem?.data.code,
          },
          children: [],
        };
      }),
    });
  }

  if (capabilities?.length) {
    treeItems.push({
      title: 'Capabilities',
      key: 'capabilities',
      data: 'capabilities',
      children: capabilities.map((c) => ({
        title: c.name,
        key: c.name,
        data: c,
        children: [],
      })),
    });
  }

  if (functions?.length) {
    treeItems.push({
      title: 'Functions',
      key: 'functions',
      data: 'functions',
      children: functions.map((f) => ({
        title: f.name,
        key: f.name,
        data: f,
        children: [],
      })),
    });
  }

  return treeItems;
};

export const moduleModelToChainModule = (
  module: IncompleteModuleModel,
): IChainModule => {
  const chainModule: IChainModule = {
    code: module.code,
    chainId: module.chainId,
    moduleName: module.name,
    hash: module.hash,
    network: module.networkId,
  };
  return chainModule;
};
