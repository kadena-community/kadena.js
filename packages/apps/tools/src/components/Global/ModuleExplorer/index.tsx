import type { IncompleteModuleModel } from '@/pages/modules/explorer/utils';
import { contractParser, IModule } from '@kadena/pactjs-generator';
import React, { useCallback, useState } from 'react';
import { TreeItem } from '../CustomTree/CustomTree';
import type { IEditorProps } from './editor';
import Editor from './editor';
import type { ISidePanelProps } from './SidePanel';
import SidePanel from './SidePanel';
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
  onReload: ISidePanelProps<IncompleteModuleModel | Outline>['onReload'];
  onExpandCollapse: ISidePanelProps<
    IncompleteModuleModel | Outline
  >['onExpandCollapse'];
}

type ElementType<T> = T extends (infer U)[] ? U : never;

export type Contract = ReturnType<typeof contractParser>[0][0]; // TODO: Should we improve this because it's a bit hacky?
export type ContractInterface = ElementType<Contract['usedInterface']> & {
  code?: string;
  chainId: ChainwebChainId;
  network: string;
};
export type ContractCapability = ElementType<Contract['capabilities']>;
export type ContractFunction = ElementType<Contract['functions']>;

export type Outline =
  | string
  | ContractInterface
  | ContractCapability
  | ContractFunction;

const chainModuleToOutlineTreeItems = (
  chainModule: IChainModule,
  items: TreeItem<IncompleteModuleModel>[],
): TreeItem<Outline>[] => {
  const treeItems: TreeItem<Outline>[] = [];

  if (!chainModule.code) {
    return treeItems;
  }

  const [, namespace] = chainModule.moduleName.split('.');
  const [[parsedContract]] = contractParser(chainModule.code, namespace);

  const { usedInterface: interfaces, capabilities, functions } = parsedContract;

  if (interfaces?.length) {
    treeItems.push({
      title: 'Interfaces',
      key: 'interfaces',
      data: 'interfaces',
      children: interfaces.map((i) => {
        const firstFind = items.find((item) => {
          return item.data.name === chainModule.network;
        });
        const secondFind = firstFind?.children.find((child) => {
          return child.data.name === i.name;
        });
        const thirdFind = secondFind?.children.find((child) => {
          return child.data.chainId === chainModule.chainId;
        });
        return {
          title: i.name,
          key: `${chainModule.network}.${i.name}`,
          label: thirdFind?.data.hash,
          data: {
            ...i,
            chainId: chainModule.chainId,
            network: chainModule.network,
            code: thirdFind?.data.code,
          },
          children: [],
        };
      }),
    });
  }

  if (capabilities?.length) {
    treeItems.push({
      title: 'Capabilities',
      key: 'capabilities',
      data: 'capabilities',
      children: capabilities.map((c) => ({
        title: c.name,
        key: c.name,
        data: c,
        children: [],
      })),
    });
  }

  if (functions?.length) {
    treeItems.push({
      title: 'Functions',
      key: 'functions',
      data: 'functions',
      children: functions.map((f) => ({
        title: f.name,
        key: f.name,
        data: f,
        children: [],
      })),
    });
  }

  return treeItems;
};

// eslint-disable-next-line react/function-component-definition
function ModuleExplorer({
  items,
  onReload,
  onExpandCollapse,
}: IModuleExplorerProps) {
  const [activeModule, setActiveModule] = useState<IChainModule>();
  const [openedModules, setOpenedModules] = useState<IChainModule[]>([]);
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
            data: {
              name: 'Explorer',
              chainId: '0',
            },
          },
          {
            title: 'Outline',
            key: 'outline',
            label: 'Outline',
            children: outlineItems,
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
