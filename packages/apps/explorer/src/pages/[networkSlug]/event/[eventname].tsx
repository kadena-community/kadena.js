import type {
  BlockQuery,
  BlocksFromHeightQuery,
  EventsQuery,
} from '@/__generated__/sdk';
import {
  useBlockQuery,
  useBlocksFromHeightQuery,
  useEventsQuery,
} from '@/__generated__/sdk';
import { blockHeightLoading } from '@/components/BlockTable/loadingBlockHeightData';
import { BlockTransactions } from '@/components/BlockTransactions/BlockTransactions';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatLink } from '@/components/CompactTable/utils/formatLink';
import { DataRenderComponent } from '@/components/DataRenderComponent/DataRenderComponent';
import { Layout } from '@/components/Layout/Layout';
import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { block } from '@/graphql/queries/block.graph';
import { useRouter } from '@/hooks/router';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { truncateValues } from '@/services/format';
import { Badge, Heading, Stack, TabItem, Tabs } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';

const Height: React.FC = () => {
  const [innerData, setInnerData] = useState<EventsQuery>(loadingEventData);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Header');

  const { setQueries } = useQueryContext();

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setSelectedTab(hash);
    }
  }, [router.asPath]);

  const eventVariables = {
    qualifiedName: router.query.eventname as string,
  };

  useEffect(() => {
    setQueries([{ query: block, variables: eventVariables }]);
  }, []);

  const { addToast } = useToast();
  const { loading, data, error } = useEventsQuery({
    variables: eventVariables,
    skip: !(router.query.eventname as string),
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
        body: 'Loading of events data failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  return (
    <Layout>
      {innerData && innerData.events && (
        <>
          <Stack margin="md">
            <Heading
              as="h1"
              className={atoms({
                display: 'flex',
                width: '100%',
                alignItems: 'center',
              })}
            >
              <ValueLoader isLoading={isLoading}>
                Block Height{' '}
                {truncateValues(router.query.height as string, {
                  length: 16,
                  endChars: 5,
                })}
              </ValueLoader>
            </Heading>
          </Stack>

          <CompactTable
            isLoading={isLoading}
            fields={[
              {
                label: 'ChainId',
                key: 'node.chainId',
                width: '20%',
              },
              {
                label: 'Height',
                key: 'node.block.height',
                width: '20%',
              },
              {
                label: 'RequestKey',
                key: 'node.requestKey',
                width: '20%',
                render: FormatLink({ appendUrl: '/transaction' }),
              },
              {
                label: 'Parameters',
                key: 'node.parameters',
                width: '40%',
              },
            ]}
            data={innerData.events.edges}
          />
        </>
      )}
    </Layout>
  );
};

export default Height;
