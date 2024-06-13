import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoManageSearch,
  MonoMenuOpen,
  MonoSearch,
  MonoVerticalSplit,
} from '@kadena/react-icons/system';

import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import {
  Box,
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/react-ui';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import CustomAccordion from '../../CustomAccordion/CustomAccordion';
import type { ICustomTreeProps, TreeItem } from '../../CustomTree/CustomTree';
import CustomTree from '../../CustomTree/CustomTree';
import {
  containerStyle,
  headingStyles,
  iconStyles,
  itemStyle,
  searchResultQueryStyles,
  searchResultsStyles,
} from './styles.css';

export interface ISidePanelProps<T> {
  items: ICustomTreeProps<T>['items'];
  isLoading?: boolean;
  onReload: ICustomTreeProps<T>['onReload'];
  onModuleClick: (module: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
  onSearch: ISearchBarProps['onSearch'];
}

function SidePanel<T>({
  items,
  onReload,
  onModuleClick,
  onExpandCollapse,
  onSearch,
}: ISidePanelProps<T>) {
  const [showSearch, setShowSearch] = useState(true || false);
  return (
    <CustomAccordion
      items={items}
      defaultExpandedKey="explorer"
      className={containerStyle}
      itemProps={{ fillHeight: true }}
    >
      {(item) => (
        <>
          <Stack
            backgroundColor="surface.default"
            justifyContent="space-between"
            alignItems={'center'}
            gap={'xxs'}
            role="button"
            onClick={item.toggleExpandCollapse}
            className={itemStyle}
          >
            {item.data.title === 'Explorer' ? (
              <MonoVerticalSplit className={iconStyles} />
            ) : (
              <MonoMenuOpen className={iconStyles} />
            )}
            <Heading variant="h6" className={headingStyles}>
              {item.data.title}
            </Heading>
            {item.data.supportsSearch ? (
              <Button
                isCompact
                variant="transparent"
                onPress={() => {
                  setShowSearch(!showSearch);
                }}
              >
                <MonoSearch />
              </Button>
            ) : null}
            <Button
              isCompact
              variant="transparent"
              onPress={item.toggleExpandCollapse}
            >
              {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
            </Button>
          </Stack>
          {item.isExpanded ? (
            <>
              {showSearch ? (
                <Search
                  networks={item.data.children.map(
                    (x) => x.key as ChainwebNetworkId,
                  )}
                  onSearch={onSearch}
                />
              ) : null}
              <CustomTree
                items={item.data.children}
                onReload={onReload}
                onItemClick={onModuleClick}
                onExpandCollapse={onExpandCollapse}
                {...item.accessibilityProps}
              />
            </>
          ) : null}
        </>
      )}
    </CustomAccordion>
  );
}

interface ISearchBarProps {
  networks: ChainwebNetworkId[];
  onSearch: (query: string) => number;
}

function Search({ networks, onSearch }: ISearchBarProps) {
  console.log('Search render', networks);
  const [searchHits, setSearchHits] = useState(0);
  const [query, setQuery] = useState('');
  // const deferredQuery = useDeferredValue(query);
  useDebounce(
    () => {
      const hits = onSearch(query);
      setSearchHits(hits);
    },
    1000,
    [query],
  );

  return (
    <Box padding="sm">
      <Stack>
        <TextField
          startVisual={<MonoManageSearch />}
          onChange={(x) => {
            console.log('onChange', { x });
            // const hits = onSearch(x.target.value);
            // console.log('onChange2', { hits });

            // setSearchHits(hits);

            setQuery(x.target.value);
          }}
        />
        <Select>
          <SelectItem>HI</SelectItem>
        </Select>
      </Stack>
      {query.length ? (
        <Text className={searchResultsStyles} as="p" size="smallest" bold>
          {`${searchHits} Modules found for `}
          <Text
            size="smallest"
            className={searchResultQueryStyles}
          >{`"${query}"`}</Text>
        </Text>
      ) : null}
    </Box>
  );
}

export default SidePanel;
