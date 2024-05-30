import type { Transaction } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import CompactTransactionsTable from '@/components/compact-transactions-table/compact-transactions-table';
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
              type="horizontal"
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
                  key: 'Payload Hash',
                  value: data.block.payloadHash,
                },
                {
                  key: 'Target',
                  value: data.block.target,
                },
                {
                  key: 'Hash',
                  value: data.block.hash,
                },
                {
                  key: 'Weight',
                  value: data.block.weight,
                },
                {
                  key: 'Epoch Start',
                  value: new Date(data.block.epoch).toLocaleString(),
                },
                {
                  key: 'Target',
                  value: data.block.target,
                },
                {
                  key: 'Flags',
                  value: data.block.flags,
                },
                {
                  key: 'Nonce',
                  value: data.block.nonce,
                },
              ]}
            />
            <DataRenderComponent
              title="Neighbors"
              fields={data.block.neighbors.map((neighbor) => ({
                key: `Chain ${neighbor.chainId}`,
                value: neighbor.hash,
                link: `/block/${neighbor.hash}`,
              }))}
            />
            <DataRenderComponent
              title="Miner"
              fields={[
                {
                  key: 'Account',
                  value: data.block.minerAccount.accountName,
                },
                {
                  key: 'Public Keys',
                  value: data.block.minerAccount.guard.keys,
                },
                {
                  key: 'Predicate',
                  value: data.block.minerAccount.guard.predicate,
                },
              ]}
            />
          </TabItem>
          <TabItem
            title={
              <>
                Transactions{' '}
                <Badge size="sm">{data.block.transactions.edges.length}</Badge>
              </>
            }
          >
            <CompactTransactionsTable
              transactions={data.block.transactions.edges.map(
                (edge) => edge.node as Transaction,
              )}
            />
          </TabItem>
        </Tabs>
      )}
    </>
  );
};

export default Block;
