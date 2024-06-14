import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
import {
  mapToTreeItems,
  modelsToTreeMap,
} from '@/pages/modules/explorer/utils';
import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import type { FuseResult, IFuseOptions } from 'fuse.js';
import Fuse from 'fuse.js';
import React, { useCallback, useMemo, useState } from 'react';
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
  // items: Omit<ISidePanelProps<IncompleteModuleModel>['items'], 'children'>;
  items: Omit<TreeItem<IncompleteModuleModel[]>, 'children'>[];
  onReload: ISidePanelProps<IncompleteModuleModel | Outline>['onReload'];
  onExpandCollapse: ISidePanelProps<
    IncompleteModuleModel | Outline
  >['onExpandCollapse'];
}

const generateDataMap = (
  items: IModuleExplorerProps['items'],
): Map<ChainwebNetworkId, IncompleteModuleModel[]> => {
  const dataMap = new Map<ChainwebNetworkId, IncompleteModuleModel[]>();

  items.forEach((item) => {
    const networkId = item.key as ChainwebNetworkId;
    dataMap.set(networkId, item.data);
  });

  return dataMap;
};

const searchResultsToDataMap = (
  results: FuseResult<IncompleteModuleModel>[],
): Map<ChainwebNetworkId, IncompleteModuleModel[]> => {
  return results.reduce<Map<ChainwebNetworkId, IncompleteModuleModel[]>>(
    (acc, result) => {
      const networkId = result.item.networkId;
      const data = acc.get(networkId) || [];
      data.push(result.item);
      acc.set(networkId, data);
      return acc;
    },
    new Map(),
  );
};

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

  // const [data, setData] = useState<
  //   Map<ChainwebNetworkId, IncompleteModuleModel[]>
  // >(generateDataMap(items));
  const data = generateDataMap(items);
  const [filteredData, setFilteredData] = useState<
    Map<ChainwebNetworkId, IncompleteModuleModel[]>
  >(new Map());

  console.log('rerender ModuleExplorer', data);

  const mapped = items.map((item) => {
    const networkId = item.key as ChainwebNetworkId;
    return {
      ...item,
      data: {
        name: item.key as string,
        chainId: '0' as const,
        networkId: networkId,
      },
      children: mapToTreeItems(
        modelsToTreeMap(
          filteredData.get(networkId) || data.get(networkId) || [],
        ),
        item.key as string,
        !filteredData.get(networkId), // Don't sort alphabetically for search results
      ),
    };
  });

  let outlineItems: TreeItem<Outline>[] = [];

  if (activeModule) {
    outlineItems = moduleToOutlineTreeItems(activeModule, mapped);
  }

  console.log('rerender ModuleExplorer', items);

  const allData = useMemo(() => {
    return items.flatMap((item) => item.data);
  }, [items]);

  const onSearch = useCallback(
    (searchQuery: string) => {
      console.log('onSearcg', { searchQuery, allData });
      const fuseOptions: IFuseOptions<IncompleteModuleModel> = {
        // isCaseSensitive: false,
        includeScore: true,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6, // 0.4 is the minimum to e.g. match "fuacet" to "faucet"
        // distance: 100,
        // useExtendedSearch: false,
        ignoreLocation: true,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
          { name: 'title', getFn: (item) => item.name },
          { name: 'hash', getFn: (item) => item.hash ?? '' },
        ],
      };

      const fuse = new Fuse(allData, fuseOptions);

      // const y = fuse.search({
      //   title: searchQuery,
      //   // hash: searchQuery,
      // });
      const y = fuse.search(searchQuery);

      console.log('searchResultComplete', y);
      console.log(
        'searchResult',
        y.map((x) => x.item.name),
      );

      setFilteredData(searchResultsToDataMap(y));

      return y.length;
    },
    [allData],
  );

  return (
    <div className={containerStyle}>
      <SidePanel<IncompleteModuleModel | Outline>
        items={[
          {
            title: 'Explorer',
            key: 'explorer',
            children: mapped,
            data: 'explorer',
            supportsSearch: true,
          },
          {
            title: 'Outline',
            key: 'outline',
            children: outlineItems,
            data: 'outline',
          },
        ]}
        onSearch={onSearch}
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
