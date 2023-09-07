import { useGetTransactionByRequestKeySubscription } from '../../__generated__/sdk';
import { Text } from '../../components/text';
import { styled } from '../../styles/stitches.config';

import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import Loader from '../../components/loader/loader';
import {
  Button,
  Heading,
  Notification,
  SystemIcon,
  Table,
} from '@kadena/react-ui';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

const RequestKey: React.FC = () => {
  const router = useRouter();

  const { loading: loadingTransaction, data: transactionSubscription } =
    useGetTransactionByRequestKeySubscription({
      variables: { requestKey: router.query.key as string },
    });

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <StyledMain>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <div>
          {loadingTransaction ? (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for request key...</span>
            </div>
          ) : (
            <div style={{ maxWidth: '1000px' }}>
              {transactionSubscription?.transaction?.badResult && (
                <Notification.Root color="negative" icon="Close">
                  Transaction failed with status:{' '}
                  {typeof transactionSubscription?.transaction?.badResult}
                </Notification.Root>
              )}
              {transactionSubscription?.transaction?.goodResult && (
                <Notification.Root color="positive" icon="Check">
                  Transaction succeeded with status:{' '}
                  {transactionSubscription?.transaction?.goodResult}
                </Notification.Root>
              )}
              {!transactionSubscription?.transaction?.goodResult &&
                !transactionSubscription?.transaction?.badResult && (
                  <Notification.Root color="warning">
                    Unknown transaction status
                  </Notification.Root>
                )}
              <br />
              <Table.Root striped>
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Request Key</strong>
                    </Table.Td>
                    <Table.Td>
                      {transactionSubscription?.transaction?.requestKey}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Chain</strong>
                    </Table.Td>
                    <Table.Td>
                      {transactionSubscription?.transaction?.chainId}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Block</strong>
                    </Table.Td>
                    <Table.Td>
                      {transactionSubscription?.transaction?.block?.id}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Code</strong>
                    </Table.Td>
                    <Table.Td>
                      {transactionSubscription?.transaction?.code}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Transaction Output</strong>
                    </Table.Td>
                    <Table.Td>
                      <Table.Root>
                        <Table.Body>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Gas</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.gas}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Result</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction
                                ?.goodResult ||
                                transactionSubscription?.transaction?.badResult}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Logs</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.logs}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Metadata</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.metadata}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Continuation</strong>
                            </Table.Td>
                            <Table.Td>
                              {
                                transactionSubscription?.transaction
                                  ?.continuation
                              }
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Transaction ID</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.txId}
                            </Table.Td>
                          </Table.Tr>
                        </Table.Body>
                      </Table.Root>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Events</strong>
                    </Table.Td>
                    <Table.Td>TODO</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Data</strong>
                    </Table.Td>
                    <Table.Td>
                      <pre>{transactionSubscription?.transaction?.data}</pre>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Nonce</strong>
                    </Table.Td>
                    <Table.Td>
                      <pre>{transactionSubscription?.transaction?.nonce}</pre>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Meta</strong>
                    </Table.Td>
                    <Table.Td>
                      <Table.Root>
                        <Table.Body>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Chain</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.chainId}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Sender</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.sender}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Gas Price</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.gasPrice}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Gas Limit</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.gasLimit}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>TTL</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.ttl}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Creation Time</strong>
                            </Table.Td>
                            <Table.Td>
                              {
                                transactionSubscription?.transaction
                                  ?.creationTime
                              }
                            </Table.Td>
                          </Table.Tr>
                        </Table.Body>
                      </Table.Root>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Signers</strong>
                    </Table.Td>
                    <Table.Td>TODO</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Signatures</strong>
                    </Table.Td>
                    <Table.Td>TODO</Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
            </div>
          )}
        </div>
      </StyledMain>
    </div>
  );
};

export default RequestKey;
