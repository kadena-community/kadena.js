import { useGetTransactionByRequestKeySubscription } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import routes from '@/constants/routes';
import { formatCode } from '@/utils/formatter';
import { Box, Breadcrumbs, Link, Notification, Table } from '@kadena/react-ui';
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
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`${routes.TRANSACTIONS}`}>
          Transactions
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transaction</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />
      <main className={mainStyle}>
        <div>
          {loadingTransaction && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for request key...</span>
            </div>
          )}
          {error && (
            <Notification.Root color="negative" icon="Close" variant="outlined">
              Unknown error:
              <Box marginBottom="$4" />
              <code>{error.message}</code>
              <Box marginBottom="$4" />
              Check if the Graph server is running.
            </Notification.Root>
          )}
          {transactionSubscription?.transaction && (
            <div style={{ maxWidth: '1000px' }}>
              {/* center content inside the div */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {transactionSubscription?.transaction?.badResult && (
                  <Notification.Root
                    color="negative"
                    icon="Close"
                    variant="outlined"
                  >
                    Transaction failed with status:{' '}
                    {typeof transactionSubscription?.transaction?.badResult}
                  </Notification.Root>
                )}
                {transactionSubscription?.transaction?.goodResult && (
                  <Notification.Root
                    color="positive"
                    icon="Check"
                    variant="outlined"
                  >
                    Transaction succeeded with status:
                    <br />
                    <pre>
                      {formatCode(
                        transactionSubscription?.transaction?.goodResult,
                      )}
                    </pre>
                  </Notification.Root>
                )}
                {!transactionSubscription?.transaction?.goodResult &&
                  !transactionSubscription?.transaction?.badResult && (
                    <Notification.Root color="warning" variant="outlined">
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
                        href={`${routes.BLOCK_OVERVIEW}/${transactionSubscription?.transaction?.block?.hash}`}
                      >
                        {transactionSubscription?.transaction?.block?.hash}
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Code</strong>
                    </Table.Td>
                    <Table.Td>
                      {JSON.parse(transactionSubscription?.transaction?.code)}
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
                              <pre>
                                {transactionSubscription?.transaction
                                  ?.goodResult
                                  ? formatCode(
                                      transactionSubscription.transaction
                                        .goodResult,
                                    )
                                  : transactionSubscription?.transaction
                                      ?.badResult
                                  ? formatCode(
                                      transactionSubscription.transaction
                                        .badResult,
                                    )
                                  : 'Unknown'}
                              </pre>
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
                              <pre>
                                {transactionSubscription?.transaction
                                  ?.continuation
                                  ? formatCode(
                                      transactionSubscription.transaction
                                        .continuation,
                                    )
                                  : 'None'}
                              </pre>
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
                                  <pre>{formatCode(event.parameterText)}</pre>
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
                              {
                                transactionSubscription?.transaction
                                  ?.senderAccount
                              }
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
