import React, { useState } from 'react';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { IChainModule } from './types';
import { getModulesMap } from './utils';

export interface IModuleExplorerProps {
  modules: IChainModule[];
  openedModules: IEditorProps['openedModules'];
  onModuleClick: ISidePanelProps['onResultClick'];
  onInterfaceClick: ISidePanelProps['onInterfaceClick'];
  onModuleExpand: ISidePanelProps['onModuleExpand'];
  onActiveModuleChange: IEditorProps['onActiveModuleChange'];
  onTabClose: IEditorProps['onTabClose'];
}

const ModuleExplorer = ({
  modules,
  openedModules: fetchedModules,
  onModuleClick,
  onInterfaceClick,
  onModuleExpand,
  onActiveModuleChange,
  onTabClose,
}: IModuleExplorerProps): React.JSX.Element => {
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const results = getModulesMap(modules);
  const [openedModules, setOpenedModules] =
    useState<IChainModule[]>(fetchedModules);
  return (
    <div className={containerStyle}>
      <SidePanel
        results={results}
        onResultClick={(result) => {
          setOpenedModules((prev) => {
            const alreadyOpened = prev.find((openedModule) => {
              return (
                openedModule.moduleName === result.moduleName &&
                openedModule.chainId === result.chainId
              );
            });

            if (alreadyOpened) {
              return prev;
            }

            let add = result;

            const enhanced = modules.find((module) => {
              return (
                module.moduleName === result.moduleName &&
                module.chainId === result.chainId
              );
            });

            if (enhanced) {
              add = enhanced;
            }

            return [...prev, add];
          });

          onModuleClick(result);
          setActiveModule(result);
        }}
        onInterfaceClick={onInterfaceClick}
        onModuleExpand={onModuleExpand}
        selectedModule={openedModules[0]}
      />
      <Editor
        openedModules={openedModules}
        activeModule={activeModule}
        onActiveModuleChange={(activeModule) => {
          onActiveModuleChange(activeModule);
          // setActiveModule(activeModule);
        }}
        onTabClose={(module) => {
          setOpenedModules(
            openedModules.filter((openedModule) => {
              return (
                `${openedModule.moduleName}-${openedModule.chainId}` !==
                `${module.moduleName}-${module.chainId}`
              );
            }),
          );
          onTabClose(module);
        }}
      />
    </div>
  );
};

export default ModuleExplorer;
