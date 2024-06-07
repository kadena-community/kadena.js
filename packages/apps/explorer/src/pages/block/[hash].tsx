import type { Transaction } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import CompactTransactionsTable from '@/components/compact-transactions-table/compact-transactions-table';
import DataRenderComponent from '@/components/data-render-component/data-render-component';
import SearchLayout from '@/components/layout/search-layout/search-layout';
import { Badge, TabItem, Tabs } from '@kadena/react-ui';

import { useRouter } from 'next/router';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';

const Block: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Header');

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setSelectedTab(hash);
    }
  }, [router.asPath]);

  const handleSelectedTab = (tab: Key): void => {
    setSelectedTab(tab as string);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`#${tab}`);
  };

  const { loading, data, error } = useBlockQuery({
    variables: {
      hash: router.query.hash as string,
    },
    skip: !router.query.hash,
  });

  return (
    <SearchLayout>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && data.block && (
        <Tabs selectedKey={selectedTab} onSelectionChange={handleSelectedTab}>
          <TabItem title="Header" key="Header">
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
            key="Transactions"
          >
            <CompactTransactionsTable
              transactions={data.block.transactions.edges.map(
                (edge) => edge.node as Transaction,
              )}
            />
          </TabItem>
        </Tabs>
      )}
    </SearchLayout>
  );
};

export default Block;
