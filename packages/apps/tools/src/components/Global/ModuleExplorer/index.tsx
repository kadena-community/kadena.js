import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import React, { useState } from 'react';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { Outline } from './types';
import { isModuleLike } from './types';
import { moduleToOutlineTreeItems } from './utils';

export interface IModuleExplorerProps {
  openedModules: IEditorProps['openedModules'];
  onModuleClick: ISidePanelProps<IncompleteModuleModel>['onModuleClick'];
  onActiveModuleChange: IEditorProps['onActiveModuleChange'];
  // onTabClose: IEditorProps['onTabClose'];
  items: ISidePanelProps<IncompleteModuleModel>['data'];
  onReload: ISidePanelProps<IncompleteModuleModel | Outline>['onReload'];
  onExpandCollapse: ISidePanelProps<
    IncompleteModuleModel | Outline
  >['onExpandCollapse'];
}

const ModuleExplorer = ({
  items,
  onReload,
  onExpandCollapse,
  onActiveModuleChange,
  openedModules: _openedModules,
}: IModuleExplorerProps) => {
  const [activeModule, setActiveModule] = useState<IncompleteModuleModel>(
    _openedModules[0],
  );

  const [openedModules, setOpenedModules] =
    useState<IncompleteModuleModel[]>(_openedModules);

  let outlineItems: TreeItem<Outline>[] = [];

  if (activeModule) {
    outlineItems = moduleToOutlineTreeItems(activeModule, items);
  }

  return (
    <div className={containerStyle}>
      <SidePanel<IncompleteModuleModel | Outline>
        data={[
          {
            title: 'Explorer',
            key: 'explorer',
            children: items,
            data: 'explorer',
          },
          {
            title: 'Outline',
            key: 'outline',
            children: outlineItems,
            data: 'outline',
          },
        ]}
        onReload={onReload}
        onModuleClick={({ data }) => {
          if (isModuleLike(data)) {
            onActiveModuleChange(data);
            setActiveModule(data);
            setOpenedModules((prev) => {
              const alreadyOpened = prev.find((openedModule) => {
                return (
                  openedModule.name === data.name &&
                  openedModule.chainId === data.chainId &&
                  openedModule.networkId === data.networkId
                );
              });

              if (alreadyOpened) {
                return prev;
              }

              return [...prev, data];
            });
          }
        }}
        onExpandCollapse={onExpandCollapse}
      />
      <Editor
        onChainTabClose={(module) => {
          setOpenedModules(
            openedModules.filter((openedModule) => {
              return (
                `${openedModule.name}-${openedModule.chainId}-${openedModule.networkId}` !==
                `${module.name}-${module.chainId}-${module.networkId}`
              );
            }),
          );
        }}
        onModuleTabClose={(modules) => {
          setOpenedModules(
            openedModules.filter((openedModule) => {
              return !modules.find((module) => {
                return (
                  `${openedModule.name}-${openedModule.chainId}-${openedModule.networkId}` ===
                  `${module.name}-${module.chainId}-${module.networkId}`
                );
              });
            }),
          );
        }}
        openedModules={openedModules}
        activeModule={activeModule}
        onActiveModuleChange={(module) => {
          onActiveModuleChange(module);
          setActiveModule(module);
        }}
        onTabClose={(module) => {
          setOpenedModules(
            openedModules.filter((openedModule) => {
              return (
                `${openedModule.name}-${openedModule.chainId}-${openedModule.networkId}` !==
                `${module.name}-${module.chainId}-${module.networkId}`
              );
            }),
          );
          // onTabClose(module);
        }}
      />
    </div>
  );
};

export default ModuleExplorer;
