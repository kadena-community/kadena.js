import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { MonoManageSearch } from '@kadena/react-icons/system';
import {
  Box,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { searchResultQueryStyles, searchResultsStyles } from './styles.css';

export interface ISearchBarProps {
  networks: ChainwebNetworkId[];
  onSearch: (query: string, filter: string) => void;
  hitsCount: number;
}

export const DEFAULT_ALL_ITEMS_KEY = 'All Networks';

const Search: FC<ISearchBarProps> = ({ networks, onSearch, hitsCount }) => {
  const [query, setQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState(DEFAULT_ALL_ITEMS_KEY);

  // const deferredQuery = useDeferredValue(query);
  useDebounce(
    () => {
      onSearch(query, searchFilter);
    },
    1000,
    [query, searchFilter],
  );

  const selectItems = [DEFAULT_ALL_ITEMS_KEY, ...networks].map((network) => ({
    key: network,
    label: network,
  }));

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
          aria-label="Search for modules"
        />
        <Select
          selectedKey={searchFilter}
          items={selectItems}
          onSelectionChange={(key) => setSearchFilter(key as string)}
          aria-label="Filter by network"
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </Stack>
      {query.length ? (
        <Text className={searchResultsStyles} as="p" size="smallest" bold>
          {`${hitsCount} Modules found for `}
          <Text
            size="smallest"
            className={searchResultQueryStyles}
          >{`"${query}"`}</Text>
        </Text>
      ) : null}
    </Box>
  );
};

export default Search;
