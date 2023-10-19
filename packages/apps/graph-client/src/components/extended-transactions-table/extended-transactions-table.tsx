import { Box, Button, Link, Table } from '@kadena/react-ui';

import type { GetTransactionsQuery } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import type { FetchMoreOptions, FetchMoreQueryOptions } from '@apollo/client';
import React from 'react';

type DataType = GetTransactionsQuery;

interface IVariableType {
  first: number | null;
  last: number | null;
  after: string | null;
  before: string | null;
}

interface IExpandedTransactionsTableProps {
  transactions: GetTransactionsQuery['transactions'];
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<IVariableType, DataType> &
      FetchMoreOptions,
  ) => Promise<any>;
}

export const ExtendedTransactionsTable = (
  props: IExpandedTransactionsTableProps,
): JSX.Element => {
  const { transactions, fetchMore } = props;

  return (
    <>
      <Box marginBottom="$3">
        <span>Showing 10 results per page</span>

        <Button
          variant="compact"
          onClick={() =>
            fetchMore({
              variables: {
                first: 20,
                last: null,
                after: transactions.pageInfo.endCursor,
                before: null,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return fetchMoreResult;
              },
            })
          }
          disabled={!transactions.pageInfo.hasNextPage}
          style={{ float: 'right' }}
        >
          Next Page
        </Button>
        <Button
          variant="compact"
          onClick={() =>
            fetchMore({
              variables: {
                first: null,
                last: 20,
                after: null,
                before: transactions.pageInfo.startCursor,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;

                if (fetchMoreResult.transactions.edges.length < 10) {
                  return {
                    ...prev,
                    transactions: {
                      ...fetchMoreResult.transactions,
                      edges: [
                        ...fetchMoreResult.transactions.edges,
                        ...prev.transactions.edges,
                      ].slice(0, 10),
                    },
                  };
                }

                return fetchMoreResult;
              },
            })
          }
          disabled={!transactions.pageInfo.hasPreviousPage}
          style={{ float: 'right', marginRight: '10px' }}
        >
          Previous Page
        </Button>
      </Box>
      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Request Key</Table.Th>
            <Table.Th>Code</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {transactions.edges.map((edge, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td>{edge?.node.chainId}</Table.Td>
                <Table.Td>
                  {new Date(edge?.node.creationTime).toLocaleString()}
                </Table.Td>
                <Table.Td>{edge?.node.height}</Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.TRANSACTIONS}/${edge?.node.requestKey}`}
                  >
                    {edge?.node.requestKey}
                  </Link>
                </Table.Td>
                <Table.Td>
                  {edge?.node.code || (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};
