import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import React, { useState } from 'react';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { IChainModule, Outline } from './types';
import { isModule } from './types';
import { chainModuleToOutlineTreeItems } from './utils';

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
            children: items,
            title: 'Explorer',
            key: 'explorer',
            label: 'Explorer',
            data: 'explorer',
          },
          {
            title: 'Outline',
            key: 'outline',
            label: 'Outline',
            children: outlineItems,
            data: 'outline',
          },
        ]}
        onReload={onReload}
        onModuleClick={({ data }) => {
          if (isModule(data)) {
            const chainModule: IChainModule = {
              code: data.code,
              chainId: data.chainId,
              moduleName: data.name,
              hash: data.hash,
              network: data.networkId,
            };
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
