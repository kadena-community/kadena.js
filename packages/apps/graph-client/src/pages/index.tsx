import { Box, Stack } from '@kadena/react-ui';

import type { Block, QueryTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlockNodesQuery,
  useGetBlocksSubscription,
  useGetRecentHeightsQuery,
  useGetTransactionsQuery,
} from '@/__generated__/sdk';
import { centerBlockStyle } from '@/components/common/center-block/styles.css';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { ErrorBox } from '@/components/error-box/error-box';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import {
  getBlockNodes,
  getRecentHeights,
  getTransactions,
} from '@/graphql/queries.graph';
import { getBlocksSubscription } from '@/graphql/subscriptions.graph';
import { ChainwebGraph } from '@components/chainweb';
import routes from '@constants/routes';
import { useChainTree } from '@context/chain-tree-context';
import { useParsedBlocks } from '@utils/hooks/use-parsed-blocks';
import { usePrevious } from '@utils/hooks/use-previous';
import isEqual from 'lodash.isequal';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const {
    loading: loadingNewBlockIds,
    data: newBlocksIds,
    error: newBlockIdsError,
  } = useGetBlocksSubscription();

  const nodesQueryVariables = {
    ids: newBlocksIds?.newBlocks as string[],
  };

  const { data: nodesQueryData, error: nodesQueryError } =
    useGetBlockNodesQuery({
      variables: nodesQueryVariables,
      skip: !newBlocksIds?.newBlocks?.length,
    });

  const [newBlocks, setNewBlocks] = useState<Block[]>([]);

  useEffect(() => {
    setNewBlocks(nodesQueryData?.nodes as Block[]);
  }, [nodesQueryData]);

  const getRecentHeightsVariables = { count: 3 };
  const { data: recentBlocks, error: recentBlocksError } =
    useGetRecentHeightsQuery({ variables: getRecentHeightsVariables });
  const previousNewBlocks = usePrevious(newBlocks);
  const previousRecentBlocks = usePrevious(recentBlocks);

  const getTransactionsVariables = { first: 10 };
  const { data: txs, error: txError } = useGetTransactionsQuery({
    variables: getTransactionsVariables,
  });

  const { allBlocks, addBlocks } = useParsedBlocks();

  const { addBlockToChain } = useChainTree();

  useEffect(() => {
    if (
      isEqual(previousNewBlocks, newBlocks) === false &&
      newBlocks?.length > 0
    ) {
      newBlocks.forEach(async (block) => {
        addBlockToChain(block);
      });
      addBlocks(newBlocks);
    }
  }, [newBlocks, addBlocks, previousNewBlocks, addBlockToChain]);

  useEffect(() => {
    if (
      isEqual(previousRecentBlocks, recentBlocks) === false &&
      recentBlocks?.completedBlockHeights &&
      recentBlocks?.completedBlockHeights?.length > 0
    ) {
      recentBlocks.completedBlockHeights.forEach(async (block) => {
        addBlockToChain(block);
      });

      addBlocks(recentBlocks?.completedBlockHeights);
    }
  }, [recentBlocks, addBlocks, previousRecentBlocks, addBlockToChain]);

  return (
    <>
      <Stack justifyContent="flex-end">
        <GraphQLQueryDialog
          queries={[
            { query: getBlocksSubscription },
            { query: getBlockNodes, variables: nodesQueryVariables },
            { query: getRecentHeights, variables: getRecentHeightsVariables },
            { query: getTransactions, variables: getTransactionsVariables },
          ]}
        />
      </Stack>

      <LoaderAndError
        error={newBlockIdsError || recentBlocksError || txError}
        loading={loadingNewBlockIds}
        loaderText="Loading..."
      />

      {nodesQueryError && <ErrorBox error={nodesQueryError} />}

      <div className={centerBlockStyle}>
        {allBlocks && <ChainwebGraph blocks={allBlocks} />}
      </div>

      {txs?.transactions && (
        <div>
          <Box margin="md" />
          <CompactTransactionsTable
            transactions={txs.transactions as QueryTransactionsConnection}
            viewAllHref={`${routes.TRANSACTIONS}`}
            description="Most recent transactions"
          />
        </div>
      )}
    </>
  );
};

export default Home;
