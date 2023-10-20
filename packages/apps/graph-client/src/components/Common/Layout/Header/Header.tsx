import routes from '@/constants/routes';
import { Text } from '@components/text';
import { Button, Grid, Input, InputWrapper, Select } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';
import { mainStyle } from '../../main/styles.css';

export interface IHeaderProps {
  appTitle?: string;
}

const Header: FC<IHeaderProps> = () => {
  const router = useRouter();

  const [searchType, setSearchType] = useState<string>('request-key');
  const [searchField, setSearchField] = useState<string>('');
  const [moduleField, setModuleField] = useState<string>('coin');
  const [defaultHashOption, setDefaultHashOption] =
    useState<string>('request-key');

  const searchTypeLabels: Record<string, string> = {
    'request-key': 'Request Key',
    account: 'Account',
    event: 'Event Name',
    block: 'Block Hash',
  };

  const searchTypePlaceholders: Record<string, string> = {
    'request-key': 'vCiATVJgm7...',
    account: 'k:1234...',
    event: 'coin.TRANSFER',
    block: 'CA9orP2yM...',
  };

  const search = (): void => {
    switch (searchType) {
      case 'request-key':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.TRANSACTIONS}/${searchField}`);
        break;
      case 'account':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.ACCOUNT}/${moduleField}/${searchField}`);
        break;
      case 'event':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.EVENT}/${searchField}`);
        break;
      case 'block':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.BLOCK_OVERVIEW}/${searchField}`);
        break;
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
    }
    if (event.target.value === 'block') {
      setDefaultHashOption('block');
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
          Kadena Graph Client
        </Text>

        <Grid.Root columns={searchType.startsWith('account') ? 4 : 3}>
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
          {searchType.startsWith('account') && (
            <Grid.Item>
              <InputWrapper htmlFor="module" label="Module name">
                <Input
                  id="module"
                  value={moduleField}
                  placeholder="coin"
                  onChange={(event) => setModuleField(event.target.value)}
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
