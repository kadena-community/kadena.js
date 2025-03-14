import type { BlockQuery } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import { BlockTransactions } from '@/components/BlockTransactions/BlockTransactions';
import { DataRenderComponent } from '@/components/DataRenderComponent/DataRenderComponent';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutAsideContentBlock } from '@/components/Layout/components/LayoutAsideContentBlock';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { loadingData } from '@/components/LoadingSkeleton/loadingData/loadingDataBlockquery';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useRouter } from '@/hooks/router';
import { Badge, TabItem, Tabs } from '@kadena/kode-ui';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';

const Block: React.FC = () => {
  const [innerData, setInnerData] = useState<BlockQuery>(loadingData);
  const { setIsLoading, isLoading } = useSearch();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Header');

  const { setQueries } = useQueryContext();

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

  const blockQueryVariables = {
    hash: router.query.hash as string,
    transactions: {
      first: 1,
      last: 1,
    },
  };

  useEffect(() => {
    setQueries([{ query: block, variables: blockQueryVariables }]);
  }, []);

  const { addToast } = useToast();
  const { loading, data, error } = useBlockQuery({
    variables: blockQueryVariables,

    skip: !router.query.hash,
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of account transactions failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  if (!innerData || !innerData.block)
    return (
      <Layout layout="full">
        <LayoutBody>
          {!Array.isArray(router.query.hash) && (
            <NoSearchResults type="blockhash" value={router.query.hash} />
          )}
        </LayoutBody>
      </Layout>
    );

  return (
    <Layout>
      <LayoutHeader>Block Hash Details</LayoutHeader>

      <LayoutAside>
        <LayoutCard>
          <LayoutAsideContentBlock
            isLoading={isLoading}
            label="Block Height"
            body={`${innerData.block.height.toString()}`}
          />

          <LayoutAsideContentBlock
            isLoading={isLoading}
            label="Creation Time"
            body={innerData.block.creationTime}
          />
          <LayoutAsideContentBlock
            isLoading={isLoading}
            label="Chain"
            body={`${innerData.block.chainId}`}
          />
        </LayoutCard>
      </LayoutAside>

      <LayoutBody>
        <Tabs
          isContained
          selectedKey={selectedTab}
          onSelectionChange={handleSelectedTab}
        >
          <TabItem title="Header" key="Header">
            <DataRenderComponent
              isLoading={isLoading}
              fields={[
                {
                  key: 'Parent',
                  value: innerData.block.parent?.hash.toString() || 'Genesis',
                  link: `/block/${innerData.block.parent?.hash}`,
                },
                {
                  key: 'POW Hash',
                  value: innerData.block.powHash,
                },
                {
                  key: 'Payload Hash',
                  value: innerData.block.payloadHash,
                },
                {
                  key: 'Target',
                  value: innerData.block.target,
                },
                {
                  key: 'Hash',
                  value: innerData.block.hash,
                  canCopy: true,
                },
                {
                  key: 'Weight',
                  value: innerData.block.weight,
                },
                {
                  key: 'Epoch Start',
                  value: new Date(innerData.block.epoch).toLocaleString(),
                },
                {
                  key: 'Target',
                  value: innerData.block.target,
                },
                {
                  key: 'Flags',
                  value: innerData.block.flags,
                },
                {
                  key: 'Nonce',
                  value: innerData.block.nonce,
                },
              ]}
            />
            <DataRenderComponent
              isLoading={isLoading}
              title="Neighbors"
              fields={innerData.block.neighbors.map((neighbor) => ({
                key: `Chain ${neighbor.chainId}`,
                value: neighbor.hash,
                link: `/block/${neighbor.hash}`,
              }))}
            />
            <DataRenderComponent
              isLoading={isLoading}
              title="Miner"
              fields={[
                {
                  key: 'Account',
                  value: innerData.block.minerAccount.accountName,
                  link: `/account/${innerData.block.minerAccount.accountName}`,
                },
                {
                  key: 'Public Keys',
                  value: innerData.block.minerAccount.guard.keys,
                },
                {
                  key: 'Predicate',
                  value: innerData.block.minerAccount.guard.predicate,
                },
              ]}
            />
          </TabItem>
          <TabItem
            title={
              <>
                Transactions{' '}
                <ValueLoader isLoading={isLoading} variant="icon">
                  <Badge style="highContrast" size="sm">
                    {innerData.block.transactions.totalCount}
                  </Badge>
                </ValueLoader>
              </>
            }
            key="Transactions"
          >
            <BlockTransactions hash={router.query.hash as string} />
          </TabItem>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Block;
