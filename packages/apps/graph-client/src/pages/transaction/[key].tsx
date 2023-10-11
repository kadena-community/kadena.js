import { Link, Notification, Table } from '@kadena/react-ui';

import { useGetTransactionByRequestKeySubscription } from '../../__generated__/sdk';
import Loader from '../../components/loader/loader';
import { mainStyle } from '../../components/main/styles.css';
import { Text } from '../../components/text';

import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const RequestKey: React.FC = () => {
  const router = useRouter();

  const {
    loading: loadingTransaction,
    data: transactionSubscription,
    error,
  } = useGetTransactionByRequestKeySubscription({
    variables: { requestKey: router.query.key as string },
  });

  return (
    <div>
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
          {loadingTransaction && (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for request key...</span>
            </div>
          )}
          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <br />
              <br />
              <code>{error.message}</code>
              <br />
              <br />
              Check if the Graph server is running.
            </Notification.Root>
          )}
          {transactionSubscription?.transaction && (
            <div style={{ maxWidth: '1000px' }}>
              {/* center content inside the div */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              </div>
              <br />
              <Table.Root striped wordBreak="break-word">
                <Table.Head>
                  <Table.Tr>
                    <Table.Th width="$40">Key</Table.Th>
                    <Table.Th>Value</Table.Th>
                  </Table.Tr>
                </Table.Head>
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
                      <Link
                        href={`/block/${transactionSubscription?.transaction?.block?.id}`}
                      >
                        {transactionSubscription?.transaction?.block?.id}
                      </Link>
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
                              {
                                transactionSubscription?.transaction
                                  ?.transactionId
                              }
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
                    <Table.Td>
                      {transactionSubscription?.transaction?.events?.map(
                        (event, index) => (
                          <Table.Root key={index}>
                            <Table.Body>
                              <Table.Tr>
                                <Table.Td>
                                  <strong>Name</strong>
                                </Table.Td>
                                <Table.Td>{event.qualifiedName}</Table.Td>
                              </Table.Tr>
                              <Table.Tr>
                                <Table.Td>
                                  <strong>Parameters</strong>
                                </Table.Td>
                                <Table.Td>
                                  <pre>
                                    {JSON.stringify(
                                      JSON.parse(event.parameterText),
                                    )}
                                  </pre>
                                </Table.Td>
                              </Table.Tr>
                            </Table.Body>
                          </Table.Root>
                        ),
                      )}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Data</strong>
                    </Table.Td>
                    <Table.Td>
                      <pre>
                        {transactionSubscription?.transaction?.data &&
                          JSON.stringify(
                            JSON.parse(
                              transactionSubscription.transaction.data,
                            ),
                            null,
                            4,
                          )}
                      </pre>
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
                          <Table.Tr>
                            <Table.Td>
                              <strong>Height</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.height}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Pact ID</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.pactId}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Proof</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.proof}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Rollback</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.rollback}
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <strong>Step</strong>
                            </Table.Td>
                            <Table.Td>
                              {transactionSubscription?.transaction?.step}
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
      </main>
    </div>
  );
};

export default RequestKey;
