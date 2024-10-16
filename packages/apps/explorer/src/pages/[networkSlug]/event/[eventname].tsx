import { FormatLinkWrapper } from '@/components/CompactTable/FormatLinkWrapper';
import { EventFilter } from '@/components/EventFilter/EventFilter';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useEvents } from '@/hooks/events';
import { TabItem, Tabs } from '@kadena/kode-ui';
import { CompactTable } from '@kadena/kode-ui/patterns';
import React from 'react';

const Height: React.FC = () => {
  const { handleSubmit, isLoading, innerData } = useEvents();

  return (
    <Layout>
      <LayoutHeader>Events</LayoutHeader>
      <LayoutAside>
        <LayoutCard>
          <EventFilter onSubmit={handleSubmit} />
        </LayoutCard>
      </LayoutAside>
      <LayoutBody>
        <Tabs isContained>
          {innerData.map((chainData) => (
            <TabItem
              title={chainData.chainId ? chainData.chainId : '-'}
              key={`chain${chainData.chainId}`}
            >
              {chainData.data.edges.length === 0 ? (
                <NoSearchResults />
              ) : (
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
                      render: FormatLinkWrapper({ url: '/transaction/:value' }),
                    },
                    {
                      label: 'Parameters',
                      key: 'node.parameters',
                      width: '45%',
                    },
                  ]}
                  data={chainData.data.edges}
                />
              )}
            </TabItem>
          ))}
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Height;
