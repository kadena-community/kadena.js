import React, { useCallback, useState } from 'react';
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
  onInterfacesExpand: ISidePanelProps['onInterfacesExpand'];
  onModuleExpand: ISidePanelProps['onModuleExpand'];
  onActiveModuleChange: IEditorProps['onActiveModuleChange'];
  onTabClose: IEditorProps['onTabClose'];
}

const ModuleExplorer = ({
  modules,
  openedModules: fetchedModules,
  onModuleClick,
  onInterfaceClick,
  onInterfacesExpand,
  onModuleExpand,
  onActiveModuleChange,
  onTabClose,
}: IModuleExplorerProps): React.JSX.Element => {
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const results = getModulesMap(modules);
  const [openedModules, setOpenedModules] =
    useState<IChainModule[]>(fetchedModules);

  const updateOpenedModules = useCallback(
    (result: IChainModule) => {
      setOpenedModules((prev) => {
        const alreadyOpened = prev.find((openedModule) => {
          return (
            openedModule.moduleName === result.moduleName &&
            openedModule.chainId === result.chainId &&
            openedModule.network === result.network
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
    },
    [modules],
  );

  return (
    <div className={containerStyle}>
      <SidePanel
        results={results}
        onResultClick={(result) => {
          updateOpenedModules(result);
          onModuleClick(result);
          setActiveModule(result);
        }}
        onInterfaceClick={(result) => {
          updateOpenedModules(result);
          onInterfaceClick(result);

          // Since the modules got updated in the `onInterfacesExpand`, we need to search for it in the updated `modules`
          const enhancedInterfaceModule = modules.find(
            (module) =>
              module.moduleName === result.moduleName &&
              module.chainId === result.chainId,
          );
          setActiveModule(enhancedInterfaceModule);
        }}
        onInterfacesExpand={onInterfacesExpand}
        onModuleExpand={onModuleExpand}
        selectedModule={activeModule}
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
          onTabClose(module);
        }}
      />
    </div>
  );
};

export default ModuleExplorer;
