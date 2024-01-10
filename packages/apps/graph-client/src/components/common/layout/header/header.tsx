import routes from '@/constants/routes';
import { Text } from '@components/text';
import {
  Button,
  FormFieldWrapper,
  Grid,
  GridItem,
  Input,
  Select,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';

import {
  SearchType,
  searchTypeLabels,
  searchTypePlaceholders,
  secondSearchFieldPlaceholders,
  secondSearchTypeLabels,
  thirdSeachTypeLabels,
  thirdSearchFieldPlaceholders,
} from '@/constants/search';
import { headerStyle } from './styles.css';

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
  const [secondSearchField, setSecondSearchField] = useState<string>('');
  const [thirdSearchField, setThirdSearchField] = useState<string>('');
  const [gridColumns, setGridColumns] = useState<number>(3);
  const [defaultHashOption, setDefaultHashOption] = useState<SearchType>(
    SearchType.Transactions,
  );

  const routeSearchTypeMapping = [
    {
      route: routes.GAS_ESTIMATION,
      searchType: SearchType.GasEstimation,
      fields: ['cmd', 'hash', 'sigs'],
    },
    {
      route: routes.NON_FUNGIBLE_ACCOUNT,
      searchType: SearchType.NonFungibleAccount,
      fields: ['account'],
    },
    {
      route: routes.ACCOUNT_ROOT,
      searchType: SearchType.Account,
      fields: ['account', 'fungible'],
    },
    {
      route: routes.BLOCK_ROOT,
      searchType: SearchType.Block,
      fields: ['hash'],
    },
    { route: routes.EVENT, searchType: SearchType.Event, fields: ['key'] },
    {
      route: routes.TRANSACTIONS,
      searchType: SearchType.Transactions,
      fields: ['key'],
    },
  ];

  const setSearchFields = (
    searchType: SearchType,
    searchField?: string,
    secondSearchField?: string,
    thirdSearchField?: string,
  ) => {
    setSearchType(searchType);
    setSearchField(searchField || '');
    setSecondSearchField(secondSearchField || '');
    setThirdSearchField(thirdSearchField || '');
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
        router.push(`${routes.ACCOUNT}/${secondSearchField}/${searchField}`);
        break;
      case SearchType.NonFungibleAccount:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.NON_FUNGIBLE_ACCOUNT}/${searchField}`);
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
          query: {
            cmd: searchField,
            hash: secondSearchField,
            sigs: thirdSearchField,
          },
        });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  const handleSearchFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchField(event.target.value);
    const fieldValue = event.target.value;

    if (searchType === SearchType.GasEstimation) {
      return;
    }

    if (
      fieldValue.startsWith('k:') ||
      fieldValue.startsWith('w:') ||
      fieldValue.startsWith('K:') ||
      fieldValue.startsWith('W:')
    ) {
      if (searchType === SearchType.NonFungibleAccount) {
        return;
      }
      setSecondSearchField('coin');
      setSearchType(SearchType.Account);
    }

    if (fieldValue.includes('.')) {
      setSearchType(SearchType.Event);
    }

    if (fieldValue.length === 43) {
      setSearchType(defaultHashOption);
    }
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearchType(event.target.value as SearchType);
    if (event.target.value === SearchType.Transactions) {
      setDefaultHashOption(SearchType.Transactions);
      setGridColumns(3);
    }
    if (event.target.value === SearchType.Block) {
      setDefaultHashOption(SearchType.Block);
      setGridColumns(3);
    }
    if (event.target.value === SearchType.Event) {
      setGridColumns(3);
    }
    if (event.target.value === SearchType.Account) {
      setSecondSearchField('coin');
      setGridColumns(4);
    }
    if (event.target.value === SearchType.GasEstimation) {
      setSecondSearchField('');
      setGridColumns(5);
    }
    if (event.target.value === SearchType.NonFungibleAccount) {
      setGridColumns(3);
    }
    setSearchField('');
  };

  return (
    <div>
      <header className={headerStyle}>
        <Text
          as="h1"
          css={{
            display: 'block',
            color: '$mauve12',
            fontSize: 48,
            marginBottom: '$6',
            cursor: 'pointer',
          }}
          onClick={() => router.push(routes.HOME)}
        >
          {title}
        </Text>

        <Grid columns={gridColumns + 1}>
          <GridItem>
            <FormFieldWrapper htmlFor="search-type" label="Search Type">
              <Select
                ariaLabel="search-type"
                id="search-type"
                onChange={handleSearchTypeChange}
                value={searchType}
              >
                <option value={SearchType.Transactions}>Request Key</option>
                <option value={SearchType.Account}>Account</option>
                <option value={SearchType.NonFungibleAccount}>
                  Non-Fungible Account
                </option>
                <option value={SearchType.Event}>Event</option>
                <option value={SearchType.Block}>Block</option>
                <option value={SearchType.GasEstimation}>Gas Estimation</option>
              </Select>
            </FormFieldWrapper>
          </GridItem>

          <GridItem>
            <FormFieldWrapper
              htmlFor="search-field"
              label={searchTypeLabels[searchType]}
            >
              <Input
                id="search-field"
                value={searchField}
                placeholder={searchTypePlaceholders[searchType]}
                onChange={handleSearchFieldChange}
                onKeyDown={handleKeyPress}
              />
            </FormFieldWrapper>
          </GridItem>

          {(searchType.startsWith('account') ||
            searchType.startsWith('gas')) && (
            <GridItem>
              <FormFieldWrapper
                htmlFor="second-search-field"
                label={secondSearchTypeLabels[searchType]}
              >
                <Input
                  id="second-search-field"
                  value={secondSearchField}
                  placeholder={secondSearchFieldPlaceholders[searchType]}
                  onChange={(event) => setSecondSearchField(event.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </FormFieldWrapper>
            </GridItem>
          )}

          {searchType.startsWith('gas') && (
            <GridItem>
              <FormFieldWrapper
                htmlFor="third-search-field"
                label={thirdSeachTypeLabels[searchType]}
              >
                <Input
                  id="third-search-field"
                  value={thirdSearchField}
                  placeholder={thirdSearchFieldPlaceholders[searchType]}
                  onChange={(event) => setThirdSearchField(event.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </FormFieldWrapper>
            </GridItem>
          )}
          <GridItem>
            <Button
              onClick={search}
              style={{
                position: 'relative',
                top: '100%',
                transform: 'translateY(-100%)',
              }}
            >
              Search
            </Button>
          </GridItem>
        </Grid>
      </header>
    </div>
  );
};

export default Header;
