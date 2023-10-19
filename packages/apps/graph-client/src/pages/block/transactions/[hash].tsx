import { useGetBlockFromHashQuery } from '@/__generated__/sdk';
import Loader from '@components/loader/loader';
import { mainStyle } from '@components/main/styles.css';
import { Text } from '@components/text';
import routes from '@constants/routes';
import { Box, Button, Link, Notification, Table } from '@kadena/react-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const BlockTransactions: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetBlockFromHashQuery({
    variables: { hash: router.query.hash as string, first: 10 },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={mainStyle}>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>
        <div>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving transactions...</span>
            </div>
          )}
          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <Box marginBottom="$4" />
              <code>{error.message}</code>
              <Box marginBottom="$4" />
              Check if the Graph server is running.
            </Notification.Root>
          )}
          {data?.block.transactions && (
            <>
              <Box marginBottom="$3">
                <span>Showing 10 results per page</span>
                <Button
                  variant="compact"
                  onClick={() =>
                    fetchMore({
                      variables: {
                        first: 10,
                        last: null,
                        after: data.block.transactions.pageInfo.endCursor,
                        before: null,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return fetchMoreResult;
                      },
                    })
                  }
                  disabled={!data.block.transactions.pageInfo.hasNextPage}
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
                        last: 10,
                        after: null,
                        before: data.block.transactions.pageInfo.startCursor,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;

                        if (
                          fetchMoreResult.block.transactions.edges.length < 10
                        ) {
                          return {
                            ...prev,
                            transactions: {
                              ...fetchMoreResult.block.transactions,
                              edges: [
                                ...fetchMoreResult.block.transactions.edges,
                                ...prev.block.transactions.edges,
                              ].slice(0, 10),
                            },
                          };
                        }

                        return fetchMoreResult;
                      },
                    })
                  }
                  disabled={!data.block.transactions.pageInfo.hasPreviousPage}
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
                  {data.block.transactions.edges.map((edge, index) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{edge?.node.chainId}</Table.Td>
                        <Table.Td>
                          {new Date(edge?.node.creationTime).toLocaleString()}
                        </Table.Td>
                        <Table.Td>{edge?.node.height}</Table.Td>
                        <Table.Td>
                          <Link
                            href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}
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
          )}
        </div>
      </main>
    </div>
  );
};

export default BlockTransactions;
