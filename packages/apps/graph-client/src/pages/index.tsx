import {
  Box,
  Button,
  Cell,
  Column,
  Link,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';

import type { Block, QueryTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlocksSubscription,
  useGetTransactionsQuery,
} from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getTransactions } from '@/graphql/queries.graph';
import { getBlocksSubscription } from '@/graphql/subscriptions.graph';
import routes from '@constants/routes';
import { atoms } from '@kadena/react-ui/styles';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [subscriptionPaused, setSubscriptionPaused] = useState(false);

  const { data: newBlocks, error: newBlocksError } = useGetBlocksSubscription({
    skip: subscriptionPaused,
  });

  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (newBlocks?.newBlocks?.length) {
      const updatedBlocks = [
        ...(newBlocks?.newBlocks as Block[]),
        ...(blocks || []),
      ];

      if (updatedBlocks.length > 10) {
        updatedBlocks.length = 10;
      }

      setBlocks(updatedBlocks);
    }
  }, [newBlocks?.newBlocks]);

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
          variant="transparent"
          onPress={() => setSubscriptionPaused(!subscriptionPaused)}
        >
          {subscriptionPaused ? 'Continue' : 'Pause'}
        </Button>

        <GraphQLQueryDialog
          queries={[
            { query: getBlocksSubscription },
            { query: getTransactions, variables: getTransactionsVariables },
          ]}
        />
      </Stack>

      <LoaderAndError
        error={newBlocksError || txError}
        loading={txLoading}
        loaderText="Loading..."
      />

      {blocks && (
        <Table className={atoms({ wordBreak: 'break-all' })} isCompact>
          <TableHeader>
            <Column>Hash</Column>
            <Column>Creation Time</Column>
            <Column>Height</Column>
            <Column>Chain</Column>
            <Column>Transactions</Column>
          </TableHeader>
          <TableBody>
            {blocks.map((block, index) => {
              return (
                <Row key={index}>
                  <Cell>
                    <Link
                      style={{ padding: 0, border: 0 }}
                      href={`${routes.BLOCK_OVERVIEW}/${block.hash}`}
                    >
                      {block.hash}
                    </Link>
                  </Cell>
                  <Cell>{new Date(block.creationTime).toLocaleString()}</Cell>
                  <Cell>{block.height}</Cell>
                  <Cell>{block.chainId}</Cell>
                  <Cell>{block.transactions.totalCount}</Cell>
                </Row>
              );
            })}
          </TableBody>
        </Table>
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
