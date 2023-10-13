import type { IEditorProps } from './editor';
import Editor from './editor';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import { containerStyle } from './styles.css';
import type { IChainModule } from './types';
import { getModulesMap } from './utils';

import React from 'react';

export interface IModuleExplorerProps {
  modules: IChainModule[];
  openedModules: IEditorProps['openedModules'];
  onModuleClick: ISidePanelProps['onResultClick'];
  onInterfaceClick: ISidePanelProps['onInterfaceClick'];
  onModuleExpand: ISidePanelProps['onModuleExpand'];
}

const ModuleExplorer = ({
  modules,
  openedModules,
  onModuleClick,
  onInterfaceClick,
  onModuleExpand,
}: IModuleExplorerProps): React.JSX.Element => {
  const results = getModulesMap(modules);
  return (
    <div className={containerStyle}>
      <SidePanel
        results={results}
        onResultClick={onModuleClick}
        onInterfaceClick={onInterfaceClick}
        onModuleExpand={onModuleExpand}
        selectedModule={openedModules[0]}
      />
      <Editor openedModules={openedModules} />
    </div>
  );
};

export default ModuleExplorer;
