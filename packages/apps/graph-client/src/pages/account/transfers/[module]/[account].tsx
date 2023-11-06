import { useGetTransfersQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ErrorBox } from '@/components/error-box/error-box';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Button, Link, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const AccountTransfers: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransfersQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
      ...(router.query.chain && { chainId: router.query.chain as string }),
      first: 10,
    },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          href={`${routes.ACCOUNT}/${router.query.module as string}/${
            router.query.account as string
          }`}
        >
          Account Overview
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transfers</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />
      <main className={mainStyle}>
        <div>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving transfers...</span>
            </div>
          )}
          {error && <ErrorBox error={error} />}
          {data?.transfers && (
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
                        after: data.transfers.pageInfo.endCursor,
                        before: null,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;

                        if (fetchMoreResult.transfers.edges.length < 10) {
                          return {
                            ...prev,
                            transactions: {
                              ...fetchMoreResult.transfers,
                              edges: [
                                ...fetchMoreResult.transfers.edges,
                                ...prev.transfers.edges,
                              ].slice(0, 10),
                            },
                          };
                        }

                        return fetchMoreResult;
                      },
                    })
                  }
                  disabled={!data.transfers.pageInfo.hasNextPage}
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
                        before: data.transfers.pageInfo.startCursor,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return fetchMoreResult;
                      },
                    })
                  }
                  disabled={!data.transfers.pageInfo.hasPreviousPage}
                  style={{ float: 'right', marginRight: '10px' }}
                >
                  Previous Page
                </Button>
              </Box>
              <Table.Root wordBreak="break-word">
                <Table.Head>
                  <Table.Tr>
                    <Table.Th>Chain</Table.Th>
                    <Table.Th>Block Height</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Sender Account</Table.Th>
                    <Table.Th>Receiver Account</Table.Th>
                    <Table.Th>Request key</Table.Th>
                  </Table.Tr>
                </Table.Head>
                <Table.Body>
                  {data.transfers.edges.map((edge, index) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{edge?.node.chainId}</Table.Td>
                        <Table.Td>{edge?.node.height}</Table.Td>
                        <Table.Td>{edge?.node.amount}</Table.Td>
                        <Table.Td>
                          {edge?.node.senderAccount ? (
                            <Link
                              href={`${routes.ACCOUNT}/${router.query.module}/${edge?.node.senderAccount}`}
                            >
                              {edge?.node.senderAccount}
                            </Link>
                          ) : (
                            <span style={{ color: 'lightgray' }}>N/A</span>
                          )}
                        </Table.Td>
                        <Table.Td>
                          {edge?.node.receiverAccount ? (
                            <Link
                              href={`${routes.ACCOUNT}/${router.query.module}/${edge?.node.receiverAccount}`}
                            >
                              {edge?.node.receiverAccount}
                            </Link>
                          ) : (
                            <span style={{ color: 'lightgray' }}>N/A</span>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Link
                            href={`${routes.TRANSACTIONS}/${edge?.node.requestKey}`}
                          >
                            {edge?.node.requestKey}
                          </Link>
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

export default AccountTransfers;
