import { useBlockQuery } from '@/__generated__/sdk';
import { TabItem, Tabs, Badge } from '@kadena/react-ui';

import { useRouter } from 'next/router';
import React from 'react';

const Block: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useBlockQuery({
    variables: {
      hash: router.query.hash as string,
    },
    skip: !router.query.hash,
  });

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && data.block && (
        <Tabs>
          <TabItem title="Header">Header Data</TabItem>
          <TabItem title="Payload">Payload Data</TabItem>
          <TabItem
            title={<>Transactions <Badge >data.block.transactions.edges.length</Badge>})</>}
          >
            Transactions Data
          </TabItem>
        </Tabs>
      )}
    </>
  );
};

export default Block;
