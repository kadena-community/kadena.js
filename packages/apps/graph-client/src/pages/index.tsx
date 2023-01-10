import { useGetBlocksSubscription } from '../__generated__/sdk';
import { ChainwebGraph } from '../components/chainweb';
import { Text } from '../components/text';
import { styled } from '../styles/stitches.config';
import { useParsedBlocks } from '../utils/hooks/use-parsed-blocks';
import { usePrevious } from '../utils/hooks/use-previous';

import isEqual from 'lodash.isequal';
import Head from 'next/head';
import React, { useEffect } from 'react';

const StyledMain: any = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

export default function Home(): JSX.Element {
  const { loading, data } = useGetBlocksSubscription();
  const previousData = usePrevious(data);

  const { allBlocks, addBlocks } = useParsedBlocks();

  useEffect(() => {
    if (
      isEqual(previousData, data) === false &&
      data?.newBlocks &&
      data?.newBlocks?.length > 0
    ) {
      addBlocks(data?.newBlocks);
    }
  }, [data]);

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
          {loading ? 'Loading...' : <ChainwebGraph blocks={allBlocks} />}
        </div>
      </StyledMain>
    </div>
  );
}
