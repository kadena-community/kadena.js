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
  openedModules,
  onModuleClick,
  onInterfaceClick,
  onModuleExpand,
  onActiveModuleChange,
  onTabClose,
}: IModuleExplorerProps): React.JSX.Element => {
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const results = getModulesMap(modules);
  return (
    <div className={containerStyle}>
      <SidePanel
        results={results}
        onResultClick={(result) => {
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
          setActiveModule(activeModule);
        }}
        onTabClose={onTabClose}
      />
    </div>
  );
};

export default ModuleExplorer;
