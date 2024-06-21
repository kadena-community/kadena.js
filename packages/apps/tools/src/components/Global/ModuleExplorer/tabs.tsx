import type { ModuleModel } from '@/hooks/use-module-query';
import type { ITabNode } from '@kadena/react-ui';
import { Box, Stack, TabItem, Tabs, Text } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC, Key } from 'react';
import React, { useCallback, useMemo } from 'react';
import {
  firstLevelTabPanelStyles,
  secondLevelTabContainerStyles,
  secondLevelTabPanelStyles,
  tabsLabelStyles,
} from './styles.css';
import { mapToTabs, moduleToTabId, modulesToMap, tabIdToModule } from './utils';

export interface ITabsProps {
  openedModules: ModuleModel[];
  activeModule: ModuleModel;
  onModuleChange: (module: ModuleModel) => void;
  onModuleTabClose: (modules: ModuleModel[]) => void;
  onChainTabClose: (module: ModuleModel) => void;
}

const EditorTabs: FC<ITabsProps> = ({
  openedModules,
  activeModule,
  onModuleChange,
  onModuleTabClose,
  onChainTabClose,
}) => {
  const { t } = useTranslation('common');
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
        const nextEntry = [...map][currIndex + 1];

        if (previousEntry) {
          onModuleChange(previousEntry[1][0]);
        } else if (nextEntry) {
          onModuleChange(nextEntry[1][0]);
        }
      }

      onChainTabClose(item.value!);
    },
    [map, onChainTabClose, onModuleChange],
  );

  return (
    <>
      <Box
        paddingBlockStart={'sm'}
        backgroundColor="surfaceHighContrast.default"
      >
        <Tabs
          items={tabs}
          selectedKey={activeModule.name}
          onSelectionChange={onParentChange}
          onClose={onParentClose}
          tabPanelClassName={firstLevelTabPanelStyles}
          borderPosition="bottom"
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
        paddingBlockStart={'sm'}
        backgroundColor="surface.default"
        className={secondLevelTabContainerStyles}
      >
        <Text className={tabsLabelStyles} size="smallest" bold>
          {t('module-on-chain')}
        </Text>
        <Tabs
          inverse
          isCompact
          items={map.get(activeModule.name)}
          onSelectionChange={onModuleChangeInternal}
          onClose={onModuleClose}
          tabPanelClassName={secondLevelTabPanelStyles}
          selectedKey={moduleToTabId(activeModule)}
          borderPosition="bottom"
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
