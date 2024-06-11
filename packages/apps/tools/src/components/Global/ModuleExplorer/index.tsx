import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
import React, { useState } from 'react';
import type { TreeItem } from '../CustomTree/CustomTree';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { Outline } from './types';
import { isCompleteModule } from './types';
import { checkModuleEquality, moduleToOutlineTreeItems } from './utils';

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
  const [activeModule, setActiveModule] = useState<ModuleModel>(
    _openedModules[0],
  );

  const [openedModules, setOpenedModules] =
    useState<ModuleModel[]>(_openedModules);

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
          if (isCompleteModule(data)) {
            onActiveModuleChange(data);
            setActiveModule(data);
            setOpenedModules((prev) => {
              const alreadyOpened = prev.find((openedModule) => {
                return checkModuleEquality(openedModule, data);
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
              return !checkModuleEquality(openedModule, module);
            }),
          );
        }}
        onModuleTabClose={(modules) => {
          setOpenedModules(
            openedModules.filter((openedModule) => {
              return !modules.find((module) => {
                return checkModuleEquality(openedModule, module);
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
      />
    </div>
  );
};

export default ModuleExplorer;
