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
import React, { useEffect } from 'react';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

const Home: React.FC = () => {
  const { loading: loadingNewBlocks, data: newBlocks } =
    useGetBlocksSubscription();
  const { loading: loadingRecentBlocks, data: recentBlocks } =
    useGetRecentHeightsQuery({ variables: { count: 3 } });
  const previousNewBlocks = usePrevious(newBlocks);
  const previousRecentBlocks = usePrevious(recentBlocks);

  const { allBlocks, addBlocks } = useParsedBlocks();

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
