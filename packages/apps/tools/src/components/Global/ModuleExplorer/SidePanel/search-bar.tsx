import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { MonoManageSearch } from '@kadena/kode-icons/system';
import {
  Box,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  searchInputStyles,
  searchResultQueryStyles,
  searchResultsStyles,
} from './styles.css';

export interface ISearchBarProps {
  networks: ChainwebNetworkId[];
  onSearch: (query: string, filter: string) => void;
  hitsCount: number;
}

export const DEFAULT_ALL_ITEMS_KEY = 'All Networks';

const Search: FC<ISearchBarProps> = ({ networks, onSearch, hitsCount }) => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState(DEFAULT_ALL_ITEMS_KEY);

  const selectItems = [DEFAULT_ALL_ITEMS_KEY, ...networks].map((network) => ({
    key: network,
    label: network,
  }));

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Let's focus the input field when the component mounts
    ref.current?.focus();

    return () => {
      onSearch('', DEFAULT_ALL_ITEMS_KEY);
    };
  }, [onSearch]);

  return (
    <Box padding="sm">
      <Stack>
        <TextField
          startVisual={<MonoManageSearch />}
          onChange={(x) => {
            setQuery(x.target.value);
            onSearch(x.target.value, searchFilter);
          }}
          className={searchInputStyles}
          aria-label={t('search-for-modules')}
          ref={ref}
        />
        <Select
          selectedKey={searchFilter}
          items={selectItems}
          onSelectionChange={(key) => {
            setSearchFilter(key as string);
            onSearch(query, key as string);
          }}
          aria-label={t('filter-by-network')}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </Stack>
      {query.length ? (
        <Text className={searchResultsStyles} as="p" size="smallest" bold>
          <Trans
            i18nKey="common:search-query-result"
            components={[
              <Text
                key={query}
                size="smallest"
                className={searchResultQueryStyles}
              >{`"${query}"`}</Text>,
            ]}
            values={{ count: hitsCount }}
          />
        </Text>
      ) : null}
    </Box>
  );
};

export default Search;
