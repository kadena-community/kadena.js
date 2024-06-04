import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import type { TabNode } from '@kadena/react-ui';
import { Stack, TabItem, Tabs, Text } from '@kadena/react-ui';
import type { FC, Key } from 'react';
import React, { useCallback, useMemo } from 'react';
import {
  firstLevelTabPanelStyles,
  secondLevelTabPanelStyles,
  tabPanelStyles,
  tabsLabelStyles,
} from './styles.css';

export interface ITabsProps {
  openedModules: ModuleModel[];
  activeModule: ModuleModel;
  onModuleChange: (module: ModuleModel) => void;
}

const modulesToMap = (modules: ModuleModel[]): Map<string, ModuleModel[]> => {
  return modules.reduce(
    (acc, module) => {
      const { name } = module;

      if (!acc.has(name)) {
        acc.set(name, []);
      }
      const chains = acc.get(name)!;

      if (!chains.includes(module)) {
        chains.push(module);
      }

      return acc;
    },
    new Map() as Map<string, ModuleModel[]>,
  );
};

const KEY_DELIMITER = '-';
const moduleToTabId = (module: ModuleModel): string => {
  return [module.networkId, module.name, module.chainId].join(KEY_DELIMITER);
};

const tabIdToModule = (tabId: string): IncompleteModuleModel => {
  const [networkId, name, chainId] = tabId.split(KEY_DELIMITER);

  return {
    networkId: networkId as ChainwebNetworkId,
    name,
    chainId: chainId as ChainwebChainId,
  };
};

const mapToTabs = (map: Map<string, ModuleModel[]>) => {
  return Array.from(map.entries()).map(([name, modules]) => {
    return {
      title: name,
      children: modules,
    };
  });
};

const Tabsss: FC<ITabsProps> = ({
  openedModules,
  activeModule,
  onModuleChange,
}) => {
  const map = useMemo(() => modulesToMap(openedModules), [openedModules]);

  const tabs = useMemo(() => mapToTabs(map), [map]);

  const onParentChange = useCallback(
    (parentKey: Key) => {
      const activeModuleToSet = map.get(parentKey as string);

      if (activeModuleToSet) {
        onModuleChange(activeModuleToSet[0]);
      }
    },
    [map, onModuleChange],
  );

  const onParentClose = useCallback(
    (
      item: TabNode<{
        title: string;
        children: ModuleModel[];
      }>,
    ) => {
      console.log('onParentClose', item);
    },
    [],
  );

  const onModuleChangeInternal = useCallback(
    (moduleKey: Key) => {
      const modulish = tabIdToModule(moduleKey as string);

      const activeModuleToSet = map.get(modulish.name)?.find((module) => {
        return (
          module.chainId === modulish.chainId &&
          module.networkId === modulish.networkId
        );
      });

      if (activeModuleToSet) {
        onModuleChange(activeModuleToSet);
      }
    },
    [map, onModuleChange],
  );

  const onModuleClose = useCallback((item: TabNode<ModuleModel>) => {
    console.log('onModuleClose', item);
  }, []);

  return (
    <>
      <Tabs
        items={tabs}
        selectedKey={activeModule.name}
        onSelectionChange={onParentChange}
        onClose={onParentClose}
        tabPanelClassName={firstLevelTabPanelStyles}
      >
        {(item) => {
          return (
            <TabItem key={item.title} title={item.title}>
              <Stack alignItems="center">
                <Text className={tabsLabelStyles}>Module on chain:</Text>
                <Tabs
                  items={item.children}
                  onSelectionChange={onModuleChangeInternal}
                  onClose={onModuleClose}
                  tabPanelClassName={secondLevelTabPanelStyles}
                >
                  {(item) => {
                    return (
                      <TabItem key={moduleToTabId(item)} title={item.chainId}>
                        {/* We render nothing, since we don't want to rerender the entire editor component every single time. */}
                        {null}
                      </TabItem>
                    );
                  }}
                </Tabs>
              </Stack>
            </TabItem>
          );
        }}
      </Tabs>
    </>
  );
};

export default Tabsss;
