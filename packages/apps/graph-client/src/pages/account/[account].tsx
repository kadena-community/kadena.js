import { mainStyle } from '../../components/main/styles.css';
import { Text } from '../../components/text';

import Head from 'next/head';
import React from 'react';

const RequestKey: React.FC = () => {
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

        <div></div>
      </main>
    </div>
  );
};

export default RequestKey;
