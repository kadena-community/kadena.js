import { Button, Grid, Input, InputWrapper, Select } from '@kadena/react-ui';

import {
  useGetBlocksSubscription,
  useGetRecentHeightsQuery,
} from '../__generated__/sdk';
import { ChainwebGraph } from '../components/chainweb';
import { mainStyle } from '../components/main/styles.css';
import { Text } from '../components/text';
import routes from '../constants/routes';
import { useChainTree } from '../context/chain-tree-context';
import { useParsedBlocks } from '../utils/hooks/use-parsed-blocks';
import { usePrevious } from '../utils/hooks/use-previous';

import isEqual from 'lodash.isequal';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  const { loading: loadingNewBlocks, data: newBlocks } =
    useGetBlocksSubscription();
  const { loading: loadingRecentBlocks, data: recentBlocks } =
    useGetRecentHeightsQuery({ variables: { count: 3 } });
  const previousNewBlocks = usePrevious(newBlocks);
  const previousRecentBlocks = usePrevious(recentBlocks);

  const { allBlocks, addBlocks } = useParsedBlocks();

  const [searchType, setSearchType] = useState<string>('request-key');
  const [searchField, setSearchField] = useState<string>('');
  const [moduleField, setModuleField] = useState<string>('');

  const search = (): void => {
    switch (searchType) {
      case 'request-key':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`/${routes.TRANSACTION}/${searchField}`);
        break;
      case 'account':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`/${routes.ACCOUNT}/${moduleField}/${searchField}`);
        break;
      case 'event':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${routes.EVENT}/${searchField}`);
        break;
    }
  };

  const { addBlockToChain } = useChainTree();

  useEffect(() => {
    if (
      isEqual(previousNewBlocks, newBlocks) === false &&
      newBlocks?.newBlocks &&
      newBlocks?.newBlocks?.length > 0
    ) {
      newBlocks.newBlocks.forEach(async (block) => {
        addBlockToChain(block);
      });
      addBlocks(newBlocks?.newBlocks);
    }
  }, [newBlocks, addBlocks, previousNewBlocks, addBlockToChain]);

  useEffect(() => {
    if (
      isEqual(previousRecentBlocks, recentBlocks) === false &&
      recentBlocks?.completedBlockHeights &&
      recentBlocks?.completedBlockHeights?.length > 0
    ) {
      recentBlocks.completedBlockHeights.forEach(async (block) => {
        addBlockToChain(block);
      });

      addBlocks(recentBlocks?.completedBlockHeights);
    }
  }, [recentBlocks, addBlocks, previousRecentBlocks, addBlockToChain]);

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={mainStyle}>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <Grid.Root columns={searchType.startsWith('account') ? 4 : 3}>
          <Grid.Item>
            <Select
              ariaLabel="search-type"
              id="search-type"
              onChange={(event) => setSearchType(event.target.value)}
            >
              <option value="request-key">Request Key</option>
              <option value="account">Account</option>
              <option value="event">Event</option>
            </Select>
          </Grid.Item>
          <Grid.Item>
            <InputWrapper htmlFor="search-field">
              <Input
                id="search-field"
                value={searchField}
                placeholder={
                  searchType === 'request-key' ? 'Request Key' : 'Account'
                }
                onChange={(event) => setSearchField(event.target.value)}
              />
            </InputWrapper>
          </Grid.Item>
          {searchType.startsWith('account') && (
            <Grid.Item>
              <InputWrapper htmlFor="module">
                <Input
                  id="module"
                  value={moduleField}
                  placeholder="Module name (e.g. 'coin')"
                  onChange={(event) => setModuleField(event.target.value)}
                />
              </InputWrapper>
            </Grid.Item>
          )}
          <Grid.Item>
            <Button onClick={search}>Search</Button>
          </Grid.Item>
        </Grid.Root>

        <div>
          {loadingRecentBlocks || loadingNewBlocks ? (
            'Loading...'
          ) : (
            <ChainwebGraph blocks={allBlocks} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
