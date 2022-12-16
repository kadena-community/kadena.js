import { useGetBlocksSubscription } from '../__generated__/sdk';
import { ChainwebHeader } from '../components/chainweb/chainweb-header';
import { ChainwebRow } from '../components/chainweb/chainweb-row';
import { Text } from '../components/text';
import { styled } from '../styles/stitches.config';
import { useParsedBlocks } from '../utils/hooks/useParsedBlocks';

import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

export default function Home(): JSX.Element {
  const { loading, data } = useGetBlocksSubscription();
  const dataString = JSON.stringify(data);

  const { allBlocks, addBlocks } = useParsedBlocks();

  useEffect(() => {
    if (data?.newBlocks && data?.newBlocks?.length > 0) {
      addBlocks(data?.newBlocks);
    }
  }, [dataString]);

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link
          rel="icon"
          href="https://kadena.io/wp-content/uploads/2021/10/Favicon-V1.png"
        />
      </Head>

      <StyledMain>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <div>
          {loading ? (
            'Loading...'
          ) : (
            <>
              <ChainwebHeader />
              {Object.entries(allBlocks)
                .reverse()
                .map(([height, blocks]) => (
                  <ChainwebRow
                    key={height}
                    height={Number(height)}
                    blocks={blocks}
                  />
                ))}
            </>
          )}
        </div>
      </StyledMain>
    </div>
  );
}
