import { useGetTransactionByRequestKeySubscription } from '@/__generated__/sdk';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import routes from '@/constants/routes';
import { formatCode, formatLisp } from '@/utils/formatter';
import { Box, Breadcrumbs, Link, Notification, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const RequestKey: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetTransactionByRequestKeySubscription({
    variables: { requestKey: router.query.key as string },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`${routes.TRANSACTIONS}`}>
          Transactions
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transaction</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Waiting for request key..."
      />

      {data?.transaction && (
        <>
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
                  <strong>Status</strong>
                </Table.Td>
                <Table.Td>
                  {data?.transaction?.badResult && (
                    <Notification.Root
                      color="negative"
                      icon="Close"
                      variant="outlined"
                    >
                      Transaction failed with status:{' '}
                      <pre>
                        {JSON.stringify(
                          JSON.parse(data?.transaction?.badResult),
                          null,
                          4,
                        )}
                      </pre>
                    </Notification.Root>
                  )}
                  {data?.transaction?.goodResult && (
                    <Notification.Root
                      color="positive"
                      icon="Check"
                      variant="outlined"
                    >
                      Transaction succeeded with status:
                      <br />
                      <pre>{formatCode(data?.transaction?.goodResult)}</pre>
                    </Notification.Root>
                  )}
                  {!data?.transaction?.goodResult &&
                    !data?.transaction?.badResult && (
                      <Notification.Root color="warning" variant="outlined">
                        Unknown transaction status
                      </Notification.Root>
                    )}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Request Key</strong>
                </Table.Td>
                <Table.Td>{data?.transaction?.requestKey}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain</strong>
                </Table.Td>
                <Table.Td>{data?.transaction?.chainId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Block</strong>
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.BLOCK_OVERVIEW}/${data?.transaction?.block?.hash}`}
                  >
                    {data?.transaction?.block?.hash}
                  </Link>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Code</strong>
                </Table.Td>
                <Table.Td>
                  <pre>{formatLisp(JSON.parse(data?.transaction?.code))}</pre>
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
                        <Table.Td>{data?.transaction?.gas}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Result</strong>
                        </Table.Td>
                        <Table.Td>
                          <pre>
                            {data?.transaction?.goodResult
                              ? formatCode(data.transaction.goodResult)
                              : data?.transaction?.badResult
                              ? formatCode(data.transaction.badResult)
                              : 'Unknown'}
                          </pre>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Logs</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.logs}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Metadata</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.metadata}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Continuation</strong>
                        </Table.Td>
                        <Table.Td>
                          <pre>
                            {data?.transaction?.continuation
                              ? formatCode(data.transaction.continuation)
                              : 'None'}
                          </pre>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Transaction ID</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.transactionId}</Table.Td>
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
                  {data?.transaction?.events?.map((event, index) => (
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
                  ))}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Data</strong>
                </Table.Td>
                <Table.Td>
                  <pre>
                    {data?.transaction?.data &&
                      JSON.stringify(
                        JSON.parse(data.transaction.data),
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
                  <pre>{data?.transaction?.nonce}</pre>
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
                        <Table.Td>{data?.transaction?.chainId}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Sender</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.senderAccount}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Gas Price</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.gasPrice}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Gas Limit</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.gasLimit}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>TTL</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.ttl}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Creation Time</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.creationTime}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Height</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.height}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Pact ID</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.pactId}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Proof</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.proof}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Rollback</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.rollback}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Step</strong>
                        </Table.Td>
                        <Table.Td>{data?.transaction?.step}</Table.Td>
                      </Table.Tr>
                    </Table.Body>
                  </Table.Root>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Signers</strong>
                </Table.Td>
                <Table.Td>
                  {data?.transaction?.signers
                    ?.map((signer) => {
                      return signer.publicKey;
                    })
                    .join(', ')}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Signatures</strong>
                </Table.Td>
                <Table.Td>
                  {data?.transaction?.signers
                    ?.map((signer) => {
                      return signer.signature;
                    })
                    .join(', ')}
                </Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
        </>
      )}
    </>
  );
};

export default RequestKey;
