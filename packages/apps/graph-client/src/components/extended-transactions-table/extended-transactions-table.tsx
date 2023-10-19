import { GetTransactionsQuery } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import { FetchMoreQueryOptions } from '@apollo/client';
import { Box, Button, Grid, Link, Select, Table } from '@kadena/react-ui';
import React, { useState } from 'react';
import { FetchMoreOptions } from '@apollo/client';

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

  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  return (
    <>
      <Box marginBottom="$3">
        <div style={{ float: 'left', textAlign: 'center', display: '' }}>
          <span style={{ display: 'inline-block' }}>Ìtems per page: </span>

          <Select
            ariaLabel="items-per-page"
            id="items-per-page"
            onChange={(event) => setItemsPerPage(parseInt(event.target.value))}
            style={{ display: 'inline-block' }}
          >
            <option value={10}>10</option>
          </Select>
        </div>

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

                if (fetchMoreResult.transactions.edges.length < 20) {
                  return {
                    ...prev,
                    transactions: {
                      ...fetchMoreResult.transactions,
                      edges: [
                        ...fetchMoreResult.transactions.edges,
                        ...prev.transactions.edges,
                      ].slice(0, 20),
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
