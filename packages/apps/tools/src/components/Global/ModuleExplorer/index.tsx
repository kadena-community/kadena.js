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
import { DEFAULT_ALL_ITEMS_KEY } from './SidePanel/search-bar';
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

const fuseOptions: IFuseOptions<IncompleteModuleModel> = {
  ignoreLocation: true,
  threshold: 0.4,
  keys: [
    { name: 'title', getFn: (item) => item.name },
    { name: 'hash', getFn: (item) => item.hash ?? '' },
  ],
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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>(
    DEFAULT_ALL_ITEMS_KEY,
  );

  const data = generateDataMap(items);

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data;
    }

    const fuse = new Fuse([...data.values()].flat(), fuseOptions);
    const results = fuse.search(searchQuery);
    return searchResultsToDataMap(results);
  }, [searchQuery, data]);

  const mapped = useMemo(() => {
    return items
      .filter((item) => {
        if (searchFilter === DEFAULT_ALL_ITEMS_KEY) {
          return true;
        }
        return item.key === searchFilter;
      })
      .map((item) => {
        const networkId = item.key as ChainwebNetworkId;
        return {
          ...item,
          label: filteredData.get(networkId)?.length ?? 0,
          data: {
            name: item.key as string,
            chainId: '0' as const,
            networkId: networkId,
          },
          children: mapToTreeItems(
            modelsToTreeMap(filteredData.get(networkId) || []),
            item.key as string,
            !searchQuery, // Don't sort alphabetically for search results
          ),
        };
      });
  }, [filteredData, items, searchFilter, searchQuery]);

  let outlineItems: TreeItem<Outline>[] = [];

  if (activeModule) {
    const data = items.find((item) => {
      return item.key === activeModule.networkId;
    })?.data;
    outlineItems = moduleToOutlineTreeItems(activeModule, data!);
  }

  const onSearch = useCallback((searchQuery: string, searchFilter: string) => {
    setSearchQuery(searchQuery);
    setSearchFilter(searchFilter);
  }, []);

  const searchHitsCount = mapped.reduce((acc, item) => {
    return acc + item.label;
  }, 0);

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
        searchHitsCount={searchHitsCount}
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
