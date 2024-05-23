import { useBlockQuery } from '@/__generated__/sdk';
import DataRenderComponent from '@/components/data-render-component/data-render-component';
import { Badge, TabItem, Tabs } from '@kadena/react-ui';

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
          <TabItem title="Header">
            <DataRenderComponent
              title="Main"
              fields={[
                {
                  key: 'Block Height',
                  value: data.block.height.toString(),
                },
                {
                  key: 'Creation Time',
                  value: new Date(data.block.creationTime).toLocaleString(),
                },
                {
                  key: 'Chain',
                  value: data.block.chainId,
                },
              ]}
            />
            <DataRenderComponent
              fields={[
                {
                  key: 'Parent',
                  value: data.block.parent?.hash.toString() || 'Genesis',
                  link: `/block/${data.block.parent?.hash}`,
                },
                {
                  key: 'POW Hash',
                  value: data.block.powHash,
                },
                {
                  key: 'Target',
                  value: data.block.target,
                },
              ]}
            />
          </TabItem>
          <TabItem title="Payload">Payload Data</TabItem>
          <TabItem
            title={
              <>
                Transactions{' '}
                <Badge size="sm">{data.block.transactions.edges.length}</Badge>
              </>
            }
          >
            Transactions Data
          </TabItem>
        </Tabs>
      )}
    </>
  );
};

export default Block;
