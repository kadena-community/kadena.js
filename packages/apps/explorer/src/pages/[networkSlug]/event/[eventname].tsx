import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatLink } from '@/components/CompactTable/utils/formatLink';
import { Layout } from '@/components/Layout/Layout';
import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useRouter } from '@/hooks/router';
import { Heading, Stack } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';

import React, { useEffect, useState } from 'react';

const Height: React.FC = () => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useSearch();
  const [innerData, setInnerData] = useState<EventsQuery>(loadingEventData);

  const { setQueries } = useQueryContext();

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
      {innerData && innerData.events.edges.length ? (
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
              Events
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
      ) : (
        <NoSearchResults />
      )}
    </Layout>
  );
};

export default Height;
