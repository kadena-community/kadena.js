import routes from '@/constants/routes';
import {
  Button,
  Heading,
  Select,
  SelectItem,
  TextField,
} from '@kadena/kode-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';

import {
  SearchType,
  searchTypeLabels,
  searchTypePlaceholders,
} from '@/constants/search';
import { headerClass, headerFormClass } from './styles.css';

export interface IHeaderProps {
  title?: string;
}

const Header: FC<IHeaderProps> = (props) => {
  const { title } = props;

  const router = useRouter();

  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.Transactions,
  );
  const [searchField, setSearchField] = useState<string>('');
  const [defaultHashOption, setDefaultHashOption] = useState<SearchType>(
    SearchType.Transactions,
  );

  const routeSearchTypeMapping = [
    {
      route: routes.GAS_ESTIMATION,
      searchType: SearchType.GasEstimation,
      fields: ['input'],
    },
    {
      route: routes.ACCOUNT_ROOT,
      searchType: SearchType.Account,
      fields: ['account'],
    },
    {
      route: routes.BLOCK_ROOT,
      searchType: SearchType.Block,
      fields: ['hash'],
    },
    {
      route: routes.EVENT,
      searchType: SearchType.Event,
      fields: ['key'],
    },
    {
      route: routes.TRANSACTIONS,
      searchType: SearchType.Transactions,
      fields: ['key'],
    },
  ];

  const setSearchFields = (searchType: SearchType, searchField?: string) => {
    setSearchType(searchType);
    setSearchField(searchField || '');
  };

  React.useEffect(() => {
    for (const mapping of routeSearchTypeMapping) {
      if (
        router.pathname.includes(mapping.route) &&
        mapping.fields.some((field) => router.query[field])
      ) {
        const fieldValues = mapping.fields.map(
          (field) => router.query[field] as string,
        );
        setSearchFields(mapping.searchType, ...fieldValues);
        return;
      }
    }
  }, [router]);

  const search = (): void => {
    switch (searchType) {
      case SearchType.Transactions:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.TRANSACTIONS}/${searchField}`);
        break;
      case SearchType.Account:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.ACCOUNT}/coin/${searchField}`);
        break;
      case SearchType.Event:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.EVENT}/${searchField}`);
        break;
      case SearchType.Block:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.BLOCK_OVERVIEW}/${searchField}`);
        break;
      case SearchType.GasEstimation:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push({
          pathname: `${routes.GAS_ESTIMATION}`,
          query: { input: searchField },
        });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  const handleSearchFieldChange = (value: string) => {
    setSearchField(value);
    const fieldValue = value;

    if (searchType === SearchType.GasEstimation) {
      return;
    }

    if (
      fieldValue.toLocaleLowerCase().startsWith('k:') ||
      fieldValue.toLocaleLowerCase().startsWith('w:')
    ) {
      setSearchType(SearchType.Account);
    }

    if (fieldValue.includes('.')) {
      setSearchType(SearchType.Event);
    }

    if (fieldValue.length === 43) {
      setSearchType(defaultHashOption);
    }
  };

  const handleSearchTypeChange = (selectedKey: string | number) => {
    setSearchType(selectedKey as SearchType);

    switch (selectedKey) {
      case SearchType.Transactions:
        setDefaultHashOption(SearchType.Transactions);
        break;
      case SearchType.Block:
        setDefaultHashOption(SearchType.Block);
        break;
    }

    setSearchField('');
  };

  return (
    <div>
      <header className={headerClass}>
        <Heading as="h1">{title}</Heading>
        <div className={headerFormClass}>
          <Select
            label="Search Type"
            id="search-type"
            onSelectionChange={handleSearchTypeChange}
            selectedKey={searchType}
          >
            <SelectItem key={SearchType.Transactions}>Request Key</SelectItem>
            <SelectItem key={SearchType.Account}>Account</SelectItem>
            <SelectItem key={SearchType.Event}>Event</SelectItem>
            <SelectItem key={SearchType.Block}>Block</SelectItem>
            <SelectItem key={SearchType.GasEstimation}>
              Gas Estimation
            </SelectItem>
          </Select>

          {/* TODO: Maybe replace with SearchField when it is implemented in the kode-ui */}
          <TextField
            label={searchTypeLabels[searchType]}
            id="search-field"
            value={searchField}
            placeholder={searchTypePlaceholders[searchType]}
            onValueChange={handleSearchFieldChange}
            onKeyDown={handleKeyPress}
          />

          <Button onPress={search}>Search</Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
