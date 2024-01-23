import { Box, Button, Link, Stack, Table } from '@kadena/react-ui';

import type { Block, QueryTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlockNodesQuery,
  useGetBlocksSubscription,
  useGetTransactionsQuery,
} from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getBlockNodes, getTransactions } from '@/graphql/queries.graph';
import { getBlocksSubscription } from '@/graphql/subscriptions.graph';
import routes from '@constants/routes';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [subscriptionPaused, setSubscriptionPaused] = useState(false);

  const { data: newBlocksIds, error: newBlockIdsError } =
    useGetBlocksSubscription({
      skip: subscriptionPaused,
    });

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
    if (nodesQueryData?.nodes?.length) {
      const updatedBlocks = [
        ...(nodesQueryData?.nodes as Block[]),
        ...(newBlocks || []),
      ];

      if (updatedBlocks.length > 10) {
        updatedBlocks.length = 10;
      }

      setNewBlocks(updatedBlocks);
    }
  }, [nodesQueryData?.nodes]);

  const getTransactionsVariables = { first: 10 };
  const {
    loading: txLoading,
    data: txs,
    error: txError,
  } = useGetTransactionsQuery({
    variables: getTransactionsVariables,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Button
          title="Toggle subscription polling."
          isCompact
          variant="text"
          onPress={() => setSubscriptionPaused(!subscriptionPaused)}
        >
          {subscriptionPaused ? 'Continue' : 'Pause'}
        </Button>

        <GraphQLQueryDialog
          queries={[
            { query: getBlocksSubscription },
            { query: getBlockNodes, variables: nodesQueryVariables },
            { query: getTransactions, variables: getTransactionsVariables },
          ]}
        />
      </Stack>

      <LoaderAndError
        error={newBlockIdsError || nodesQueryError || txError}
        loading={txLoading}
        loaderText="Loading..."
      />

      {newBlocks && (
        <Table.Root wordBreak="break-word">
          <Table.Head>
            <Table.Tr>
              <Table.Th>Hash</Table.Th>
              <Table.Th>Creation Time</Table.Th>
              <Table.Th>Height</Table.Th>
              <Table.Th>Chain</Table.Th>
              <Table.Th>Confirmation Depth</Table.Th>
              <Table.Th>Transactions</Table.Th>
            </Table.Tr>
          </Table.Head>
          <Table.Body>
            {newBlocks.map((block, index) => {
              return (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Link
                      style={{ padding: 0, border: 0 }}
                      href={`${routes.BLOCK_OVERVIEW}/${block.hash}`}
                    >
                      {block.hash}
                    </Link>
                  </Table.Td>
                  <Table.Td>
                    {new Date(block.creationTime).toLocaleString()}
                  </Table.Td>
                  <Table.Td>{block.height}</Table.Td>
                  <Table.Td>{block.chainId}</Table.Td>
                  <Table.Td>{block.confirmationDepth}</Table.Td>
                  <Table.Td>{block.transactions.totalCount}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Body>
        </Table.Root>
      )}

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
