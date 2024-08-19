import type { BlocksFromHeightQuery } from '@/__generated__/sdk';
import { useBlocksFromHeightQuery } from '@/__generated__/sdk';
import { blockHeightLoading } from '@/components/BlockTable/loadingBlockHeightData';
import { CompactTable } from '@/components/CompactTable/CompactTable';
import { FormatLink } from '@/components/CompactTable/utils/formatLink';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useRouter } from '@/hooks/router';
import { truncateValues } from '@/services/format';

import React, { useEffect, useState } from 'react';

const Height: React.FC = () => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useSearch();
  const [innerData, setInnerData] =
    useState<BlocksFromHeightQuery>(blockHeightLoading);
  const { setQueries } = useQueryContext();

  const blockHeightVariables = {
    first: 200,
    startHeight: parseInt(router.query.height as string),
    endHeight: parseInt(router.query.height as string),
  };

  useEffect(() => {
    setQueries([{ query: block, variables: blockHeightVariables }]);
  }, []);

  const { addToast } = useToast();
  const { loading, data, error } = useBlocksFromHeightQuery({
    variables: blockHeightVariables,
    skip: !(router.query.height as string),
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
      setIsLoading(false);
      setInnerData({} as BlocksFromHeightQuery);
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of block height data failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  if (!innerData || !innerData.blocksFromHeight)
    return (
      <Layout layout="full">
        <LayoutBody>
          <NoSearchResults />
        </LayoutBody>
      </Layout>
    );

  return (
    <Layout>
      <LayoutHeader>
        <ValueLoader isLoading={isLoading}>
          Block Height{' '}
          {truncateValues(router.query.height as string, {
            length: 16,
            endChars: 5,
          })}
        </ValueLoader>
      </LayoutHeader>

      <LayoutBody>
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
              key: 'node.height',
              width: '20%',
            },
            {
              label: 'Hash',
              key: 'node.hash',
              width: '60%',
              render: FormatLink({ appendUrl: '/block' }),
            },
          ]}
          data={innerData?.blocksFromHeight.edges ?? []}
        />
      </LayoutBody>
    </Layout>
  );
};

export default Height;
