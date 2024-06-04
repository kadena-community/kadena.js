import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import type { ElementType } from '@/types/utils';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { contractParser } from '@kadena/pactjs-generator';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { Outline } from './types';

export type Contract = ReturnType<typeof contractParser>[0][0]; // TODO: Should we improve this because it's a bit hacky?
export type ContractInterface = ElementType<Contract['usedInterface']> & {
  code?: string;
  chainId: ChainwebChainId;
  networkId: ChainwebNetworkId;
};
export type ContractCapability = ElementType<Contract['capabilities']>;
export type ContractFunction = ElementType<Contract['functions']>;

export const moduleToOutlineTreeItems = (
  module: IncompleteModuleModel,
  items: TreeItem<IncompleteModuleModel>[],
): TreeItem<Outline>[] => {
  const treeItems: TreeItem<Outline>[] = [];

  if (!module.code) {
    return treeItems;
  }

  const [, namespace] = module.name.split('.');
  const [[parsedContract]] = contractParser(module.code, namespace);

  const { usedInterface: interfaces, capabilities, functions } = parsedContract;

  if (interfaces?.length) {
    treeItems.push({
      title: 'Interfaces',
      key: 'interfaces',
      data: {
        name: 'interfaces',
        chainId: module.chainId,
        networkId: module.networkId,
      },
      children: interfaces.map((i) => {
        // Top level, one of the networks
        const networkItems = items.find((item) => {
          return item.data.networkId === module.networkId;
        });
        // The second level, the module on certain chains
        const chainModules = networkItems?.children.find((child) => {
          return child.data.name === i.name;
        });
        // And now the final search, the module on the specific chain
        const moduleTreeItem = chainModules?.children.find((child) => {
          return child.data.chainId === module.chainId;
        });

        return {
          title: i.name,
          key: `${module.networkId}.${i.name}`,
          label: moduleTreeItem?.data.hash,
          data: {
            ...i,
            chainId: module.chainId,
            networkId: module.networkId,
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
