import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatLink } from '@/components/CompactTable/utils/formatLink';
import { EventFilter } from '@/components/EventFilter/EventFilter';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useEvents } from '@/hooks/events';
import { TabItem, Tabs } from '@kadena/kode-ui';
import React from 'react';

const Height: React.FC = () => {
  const { handleSubmit, isLoading, innerData } = useEvents();

  if (!innerData.length || !innerData[0].query.edges?.length)
    return (
      <Layout layout="full">
        <LayoutBody>
          <NoSearchResults />
        </LayoutBody>
      </Layout>
    );

  return (
    <Layout>
      <LayoutHeader>Events</LayoutHeader>
      <LayoutAside>
        <LayoutCard>
          <EventFilter onSubmit={handleSubmit} />
        </LayoutCard>
      </LayoutAside>
      <LayoutBody>
        <Tabs isCompact isContained>
          {innerData.map((chainData) => (
            <TabItem
              title={chainData.chainId ? chainData.chainId : '-'}
              key={`chain${chainData.chainId}`}
            >
              <CompactTable
                isLoading={isLoading}
                fields={[
                  {
                    label: 'Height',
                    key: 'node.block.height',
                    width: '15%',
                  },
                  {
                    label: 'RequestKey',
                    key: 'node.requestKey',
                    width: '40%',
                    render: FormatLink({ appendUrl: '/transaction' }),
                  },
                  {
                    label: 'Parameters',
                    key: 'node.parameters',
                    width: '45%',
                  },
                ]}
                data={chainData.query.edges}
              />
            </TabItem>
          ))}
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Height;
