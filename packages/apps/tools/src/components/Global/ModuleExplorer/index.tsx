import type { IncompleteModuleModel } from '@/pages/modules/explorer/utils';
import React, { useCallback, useState } from 'react';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
import type { IEditorProps } from './editor';
import Editor from './editor';
import { containerStyle } from './styles.css';
import type { IChainModule } from './types';
import { getModulesMap } from './utils';

export interface IModuleExplorerProps {
  // modules: IChainModule[];
  // openedModules: IEditorProps['openedModules'];
  // onModuleClick: ISidePanelProps['onResultClick'];
  // onInterfaceClick: ISidePanelProps['onInterfaceClick'];
  // onInterfacesExpand: ISidePanelProps['onInterfacesExpand'];
  // onModuleExpand: ISidePanelProps['onModuleExpand'];
  // onActiveModuleChange: IEditorProps['onActiveModuleChange'];
  // onTabClose: IEditorProps['onTabClose'];
  items: ISidePanelProps<IncompleteModuleModel>['data'];
  onReload: ISidePanelProps<IncompleteModuleModel>['onReload'];
  onExpandCollapse: ISidePanelProps<IncompleteModuleModel>['onExpandCollapse'];
}

// eslint-disable-next-line react/function-component-definition
function ModuleExplorer({
  items,
  onReload,
  onExpandCollapse,
}: IModuleExplorerProps) {
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const [openedModules, setOpenedModules] = useState<IChainModule[]>([]);

  return (
    <div className={containerStyle}>
      <SidePanel
        data={[
          {
            children: items,
            title: 'Explorer',
            key: 'explorer',
            label: 'Explorer',
            data: {
              name: 'Explorer',
              chainId: '0',
            },
          },
          {
            title: 'Outline',
            key: 'outline',
            label: 'Outline',
            children: [],
            data: {
              name: 'Outline',
              chainId: '0',
            },
          },
        ]}
        onReload={onReload}
        onModuleClick={(x) => {
          const [network, moduleName] = (x.key as string).split('.');
          const chainModule: IChainModule = {
            code: x.data.code,
            chainId: x.data.chainId,
            moduleName,
            hash: x.data.hash,
            network,
          };
          setActiveModule(chainModule);
          setOpenedModules([chainModule]);
        }}
        onExpandCollapse={onExpandCollapse}
      />
      {/* <SidePanel>
        <Item></Item>
        <Item></Item>
      </SidePanel> */}
      <Editor
        openedModules={openedModules}
        activeModule={activeModule}
        onActiveModuleChange={(module) => {
          // onActiveModuleChange(module);
          // setActiveModule(module);
        }}
        onTabClose={(module) => {
          // setOpenedModules(
          //   openedModules.filter((openedModule) => {
          //     return (
          //       `${openedModule.moduleName}-${openedModule.chainId}-${openedModule.network}` !==
          //       `${module.moduleName}-${module.chainId}-${module.network}`
          //     );
          //   }),
          // );
          // onTabClose(module);
        }}
      />
    </div>
  );
}

// const ModuleExplorer = ({
//   modules,
//   openedModules: fetchedModules,
//   onModuleClick,
//   onInterfaceClick,
//   onInterfacesExpand,
//   onModuleExpand,
//   onActiveModuleChange,
//   onTabClose,
// }: IModuleExplorerProps): React.JSX.Element => {
//   const [activeModule, setActiveModule] = useState<IChainModule>();
//   const results = getModulesMap(modules);
//   const [openedModules, setOpenedModules] =
//     useState<IChainModule[]>(fetchedModules);

//   const updateOpenedModules = useCallback(
//     (result: IChainModule) => {
//       setOpenedModules((prev) => {
//         const alreadyOpened = prev.find((openedModule) => {
//           return (
//             openedModule.moduleName === result.moduleName &&
//             openedModule.chainId === result.chainId &&
//             openedModule.network === result.network
//           );
//         });

//         if (alreadyOpened) {
//           return prev;
//         }

//         let add = result;

//         const enhanced = modules.find((module) => {
//           return (
//             module.moduleName === result.moduleName &&
//             module.chainId === result.chainId
//           );
//         });

//         if (enhanced) {
//           add = enhanced;
//         }

//         return [...prev, add];
//       });
//     },
//     [modules],
//   );

//   return (
//     <div className={containerStyle}>
//       <SidePanel
//         data={[]}
//         // results={results}
//         // onResultClick={(result) => {
//         //   updateOpenedModules(result);
//         //   onModuleClick(result);
//         //   setActiveModule(result);
//         // }}
//         // onInterfaceClick={(result) => {
//         //   updateOpenedModules(result);
//         //   onInterfaceClick(result);
//         //   setActiveModule(result);
//         // }}
//         // onInterfacesExpand={onInterfacesExpand}
//         // onModuleExpand={onModuleExpand}
//         // selectedModule={activeModule}
//       />
//       <Editor
//         openedModules={openedModules}
//         activeModule={activeModule}
//         onActiveModuleChange={(module) => {
//           onActiveModuleChange(module);
//           setActiveModule(module);
//         }}
//         onTabClose={(module) => {
//           setOpenedModules(
//             openedModules.filter((openedModule) => {
//               return (
//                 `${openedModule.moduleName}-${openedModule.chainId}-${openedModule.network}` !==
//                 `${module.moduleName}-${module.chainId}-${module.network}`
//               );
//             }),
//           );
//           onTabClose(module);
//         }}
//       />
//     </div>
//   );
// };

export default ModuleExplorer;
