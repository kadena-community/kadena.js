import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import type { ITabNode } from '@kadena/react-ui';
import { Box, Stack, TabItem, Tabs, Text } from '@kadena/react-ui';
import type { FC, Key } from 'react';
import React, { useCallback, useMemo } from 'react';
import {
  firstLevelTabPanelStyles,
  secondLevelTabContainerStyles,
  secondLevelTabPanelStyles,
  tabsLabelStyles,
} from './styles.css';

export interface ITabsProps {
  openedModules: ModuleModel[];
  activeModule: ModuleModel;
  onModuleChange: (module: ModuleModel) => void;
  onModuleTabClose: (modules: ModuleModel[]) => void;
  onChainTabClose: (module: ModuleModel) => void;
}

const modulesToMap = (modules: ModuleModel[]): Map<string, ModuleModel[]> => {
  return modules.reduce<Map<string, ModuleModel[]>>((acc, module) => {
    const { name } = module;

    if (!acc.has(name)) {
      acc.set(name, []);
    }
    const chains = acc.get(name)!;

    if (!chains.includes(module)) {
      chains.push(module);
    }

    return acc;
  }, new Map());
};

const KEY_DELIMITER = '!_&_!'; // A character sequence that is unlikely to appear in a module name.

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

const EditorTabs: FC<ITabsProps> = ({
  openedModules,
  activeModule,
  onModuleChange,
  onModuleTabClose,
  onChainTabClose,
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
      item: ITabNode<{
        title: string;
        children: ModuleModel[];
      }>,
    ) => {
      const modulesToClose = map.get(item.key as string);

      if (modulesToClose) {
        const activeModuleToSet = map.get(
          (item.prevKey ?? item.nextKey) as string,
        );

        if (activeModuleToSet) {
          onModuleChange(activeModuleToSet[0]);
        }
        onModuleTabClose(modulesToClose);
      }
    },
    [map, onModuleTabClose, onModuleChange],
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

  const onModuleClose = useCallback(
    (item: ITabNode<ModuleModel>) => {
      if (map.get(item.value!.name)?.length === 1) {
        const currIndex = [...map].findIndex(([key, value]) => {
          return value.includes(item.value!);
        });

        const previousEntry = [...map][currIndex - 1];

        if (previousEntry) {
          onModuleChange(previousEntry[1][0]);
        }
      }

      onChainTabClose(item.value!);
    },
    [map, onChainTabClose, onModuleChange],
  );

  return (
    <>
      <Box
        paddingBlockStart={'md'}
        backgroundColor="surfaceHighContrast.default"
      >
        <Tabs
          items={tabs}
          selectedKey={activeModule.name}
          onSelectionChange={onParentChange}
          onClose={onParentClose}
          tabPanelClassName={firstLevelTabPanelStyles}
          isCompact
        >
          {(item) => (
            <TabItem key={item.title} title={item.title}>
              {/* We render nothing, since we don't want to rerender the sub tabs below every single time. */}
              {null}
            </TabItem>
          )}
        </Tabs>
      </Box>
      <Stack
        alignItems="center"
        paddingInlineStart={'md'}
        paddingBlockStart={'md'}
        backgroundColor="surface.default"
        className={secondLevelTabContainerStyles}
      >
        <Text className={tabsLabelStyles} size="smallest" bold>
          Module on chain:
        </Text>
        <Tabs
          inverse
          isCompact
          items={map.get(activeModule.name)}
          onSelectionChange={onModuleChangeInternal}
          onClose={onModuleClose}
          tabPanelClassName={secondLevelTabPanelStyles}
          selectedKey={moduleToTabId(activeModule)}
        >
          {(item) => (
            <TabItem key={moduleToTabId(item)} title={item.chainId}>
              {/* We render nothing, since we don't want to rerender the entire editor component every single time. */}
              {null}
            </TabItem>
          )}
        </Tabs>
      </Stack>
    </>
  );
};

export default EditorTabs;
