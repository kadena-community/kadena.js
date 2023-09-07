import { useGetTransactionSubscription } from '../../__generated__/sdk';
import { Text } from '../../components/text';
import { styled } from '../../styles/stitches.config';

import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import Loader from '../../components/loader/loader';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

const RequestKey: React.FC = () => {
  const router = useRouter();

  const { loading: loadingTransaction, data: transactionSubscription } =
    useGetTransactionSubscription({
      variables: { requestKey: router.query.key as string },
    });

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
          {loadingTransaction ? (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader/>
              <span>Waiting for request key...</span>
            </div>
          ) : (
            <a>{transactionSubscription?.transaction?.id}</a>
          )}
        </div>
      </StyledMain>
    </div>
  );
};

export default RequestKey;
