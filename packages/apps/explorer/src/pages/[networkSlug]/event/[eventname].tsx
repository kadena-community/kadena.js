import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatLink } from '@/components/CompactTable/utils/formatLink';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { CONSTANTS } from '@/constants/constants';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useRouter } from '@/hooks/router';
import {
  Badge,
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  TabItem,
  Tabs,
  TextField,
} from '@kadena/kode-ui';

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

  if (!innerData || !innerData.events.edges.length)
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
          <Heading as="h5">Filters</Heading>
          <TextField label="Chains" placeholder="1, 2, 3, ..."></TextField>

          <Stack width="100%" justifyContent="space-between">
            <Button isCompact variant="outlined">
              Reset
            </Button>
            <Button isCompact variant="primary">
              Apply
            </Button>
          </Stack>
        </LayoutCard>
      </LayoutAside>
      <LayoutBody>
        <Tabs isCompact isContained>
          <TabItem
            title={
              <>
                1{' '}
                <ValueLoader isLoading={isLoading} variant="icon">
                  <Badge style="highContrast" size="sm">
                    {innerData.events.edges.length}
                  </Badge>
                </ValueLoader>
              </>
            }
            key="chain"
          >
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
          </TabItem>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Height;
