import routes from '@/constants/routes';
import { Text } from '@components/text';
import { Button, Grid, Input, InputWrapper, Select } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';
import { mainStyle } from '../../main/styles.css';

export interface IHeaderProps {
  title?: string;
}

const Header: FC<IHeaderProps> = (props) => {
  const { title } = props;

  const router = useRouter();

  const [searchType, setSearchType] = useState<string>('request-key');
  const [searchField, setSearchField] = useState<string>('');
  const [secondSearchField, setSecondSearchField] = useState<string>('');
  const [thirdSearchField, setThirdSearchField] = useState<string>('');
  const [gridColumns, setGridColumns] = useState<number>(3);
  const [defaultHashOption, setDefaultHashOption] =
    useState<string>('request-key');

  const searchTypeLabels: Record<string, string> = {
    'request-key': 'Request Key',
    account: 'Account',
    event: 'Event Name',
    block: 'Block Hash',
    gasEstimation: 'Cmd',
  };

  const searchTypePlaceholders: Record<string, string> = {
    'request-key': 'vCiATVJgm7...',
    account: 'k:1234...',
    event: 'coin.TRANSFER',
    block: 'CA9orP2yM...',
    gasEstimation: 'cmd',
  };

  const secondSearchTypeLabels: Record<string, string> = {
    account: 'Module',
    gasEstimation: 'Hash',
  };

  const secondSearchFieldPlaceholders: Record<string, string> = {
    account: 'coin',
    gasEstimation: 'hash',
  };

  const thirdSeachTypeLabels: Record<string, string> = {
    gasEstimation: 'Signatures',
  };

  const thirdSearchFieldPlaceholders: Record<string, string> = {
    gasEstimation: 'sigs',
  };

  const search = (): void => {
    switch (searchType) {
      case 'request-key':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.TRANSACTIONS}/${searchField}`);
        break;
      case 'account':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.ACCOUNT}/${secondSearchField}/${searchField}`);
        break;
      case 'event':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.EVENT}/${searchField}`);
        break;
      case 'block':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.BLOCK_OVERVIEW}/${searchField}`);
        break;
      case 'gasEstimation':
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

    if (searchType === 'gasEstimation') {
      return;
    }

    if (
      fieldValue.startsWith('k:') ||
      fieldValue.startsWith('w:') ||
      fieldValue.startsWith('K:') ||
      fieldValue.startsWith('W:')
    ) {
      setSearchType('account');
    }

    if (fieldValue.includes('.')) {
      setSearchType('event');
    }

    if (fieldValue.length === 43) {
      setSearchType(defaultHashOption);
    }
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearchType(event.target.value);
    if (event.target.value === 'request-key') {
      setDefaultHashOption('request-key');
      setGridColumns(3);
    }
    if (event.target.value === 'block') {
      setDefaultHashOption('block');
      setGridColumns(3);
    }
    if (event.target.value === 'event') {
      setGridColumns(3);
    }
    if (event.target.value === 'account') {
      setSecondSearchField('coin');
      setGridColumns(4);
    }
    if (event.target.value === 'gasEstimation') {
      setSecondSearchField('');
      setGridColumns(5);
    }
  };

  return (
    <div>
      <main className={mainStyle}>
        <Text
          as="h1"
          css={{
            display: 'block',
            color: '$mauve12',
            fontSize: 48,
            my: '$12',
            cursor: 'pointer',
          }}
          onClick={() => router.push(routes.HOME)}
        >
          {title}
        </Text>

        <Grid.Root columns={gridColumns}>
          <Grid.Item>
            <InputWrapper htmlFor="search-type" label="Search Type">
              <Select
                ariaLabel="search-type"
                id="search-type"
                onChange={handleSearchTypeChange}
                value={searchType}
              >
                <option value="request-key">Request Key</option>
                <option value="account">Account</option>
                <option value="event">Event</option>
                <option value="block">Block</option>
                <option value="gasEstimation">Gas Estimation</option>
              </Select>
            </InputWrapper>
          </Grid.Item>

          <Grid.Item>
            <InputWrapper
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
            </InputWrapper>
          </Grid.Item>

          {(searchType.startsWith('account') ||
            searchType.startsWith('gas')) && (
            <Grid.Item>
              <InputWrapper
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
              </InputWrapper>
            </Grid.Item>
          )}

          {searchType.startsWith('gas') && (
            <Grid.Item>
              <InputWrapper
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
              </InputWrapper>
            </Grid.Item>
          )}
          <Grid.Item>
            <Button
              onClick={search}
              style={{
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              Search
            </Button>
          </Grid.Item>
        </Grid.Root>
      </main>
    </div>
  );
};

export default Header;
