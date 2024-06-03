import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import React, { useState } from 'react';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { IChainModule, Outline } from './types';
import { isModuleLike } from './types';
import {
  chainModuleToOutlineTreeItems,
  moduleModelToChainModule,
} from './utils';

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
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const [openedModules, setOpenedModules] =
    useState<IChainModule[]>(_openedModules);
  let outlineItems: TreeItem<Outline>[] = [];

  if (activeModule) {
    outlineItems = chainModuleToOutlineTreeItems(activeModule, items);
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
            const chainModule: IChainModule = moduleModelToChainModule(data);
            setActiveModule(chainModule);
            setOpenedModules((prev) => {
              const alreadyOpened = prev.find((openedModule) => {
                return (
                  openedModule.moduleName === chainModule.moduleName &&
                  openedModule.chainId === chainModule.chainId &&
                  openedModule.network === chainModule.network
                );
              });

              if (alreadyOpened) {
                return prev;
              }

              return [...prev, chainModule];
            });
          }
        }}
        onExpandCollapse={onExpandCollapse}
      />
      <Editor
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
                `${openedModule.moduleName}-${openedModule.chainId}-${openedModule.network}` !==
                `${module.moduleName}-${module.chainId}-${module.network}`
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
