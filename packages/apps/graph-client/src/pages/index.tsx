import { Button, Grid, Input, InputWrapper, Option, Select } from '@kadena/react-ui';
import {
  useGetBlocksSubscription,
  useGetRecentHeightsQuery,
} from '../__generated__/sdk';
import { ChainwebGraph } from '../components/chainweb';
import { Text } from '../components/text';
import { styled } from '../styles/stitches.config';
import { useParsedBlocks } from '../utils/hooks/use-parsed-blocks';
import { usePrevious } from '../utils/hooks/use-previous';

import isEqual from 'lodash.isequal';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

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

  const search = () => {
    if (searchType === 'request-key') {
      router.push(`/transaction/${searchField}`);
    }
  };

  useEffect(() => {
    if (
      isEqual(previousNewBlocks, newBlocks) === false &&
      newBlocks?.newBlocks &&
      newBlocks?.newBlocks?.length > 0
    ) {
      addBlocks(newBlocks?.newBlocks);
    }
  }, [newBlocks]);

  useEffect(() => {
    if (
      isEqual(previousRecentBlocks, recentBlocks) === false &&
      recentBlocks?.completedBlockHeights &&
      recentBlocks?.completedBlockHeights?.length > 0
    ) {
      addBlocks(recentBlocks?.completedBlockHeights);
    }
  }, [recentBlocks]);

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <StyledMain>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <Grid.Root columns={3}>
          <Grid.Item>
            <Select
              style={{ marginTop: '9px' }}
              ariaLabel="search-type"
              id="search-type"
              onChange={(event) => setSearchType(event.target.value)}
            >
              <Option value="request-key">Request Key</Option>
            </Select>
          </Grid.Item>
          <Grid.Item>
            <InputWrapper htmlFor="search-field">
              <Input
                id="seacrh-field"
                value={searchField}
                onChange={(event) => setSearchField(event.target.value)}
              />
            </InputWrapper>
          </Grid.Item>
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
      </StyledMain>
    </div>
  );
};

export default Home;
