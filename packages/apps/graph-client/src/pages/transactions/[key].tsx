import type { Transaction } from '@/__generated__/sdk';
import {
  useGetTransactionByRequestKeySubscription,
  useGetTransactionNodeQuery,
} from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { getTransactionNode } from '@/graphql/queries.graph';
import { getTransactionByRequestKey } from '@/graphql/subscriptions.graph';
import { formatCode, formatLisp } from '@/utils/formatter';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Link,
  Notification,
  Stack,
  SystemIcon,
  Table,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const RequestKey: React.FC = () => {
  const router = useRouter();

  const transactionSubscriptionVariables = {
    requestKey: router.query.key as string,
  };

  const {
    loading: transactionSubscriptionLoading,
    data: transactionSubscriptionData,
    error: transactionSubscriptionError,
  } = useGetTransactionByRequestKeySubscription({
    variables: transactionSubscriptionVariables,
    skip: !router.query.key,
  });

  const nodeQueryVariables = {
    id: transactionSubscriptionData?.transaction as string,
  };

  const {
    loading: nodeQueryLoading,
    data: nodeQueryData,
    error: nodeQueryError,
  } = useGetTransactionNodeQuery({
    variables: nodeQueryVariables,
    skip: !transactionSubscriptionData?.transaction,
  });

  const transaction = nodeQueryData?.node as Transaction;

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem href={`${routes.TRANSACTIONS}`}>
            Transactions
          </BreadcrumbsItem>
          <BreadcrumbsItem>Transaction</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[
            {
              query: getTransactionByRequestKey,
              variables: transactionSubscriptionVariables,
            },
            {
              query: getTransactionNode,
              variables: nodeQueryVariables,
            },
          ]}
        />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={transactionSubscriptionError}
        loading={transactionSubscriptionLoading}
        loaderText="Waiting for transaction to come in..."
      />
      {!transactionSubscriptionLoading &&
        !transactionSubscriptionError &&
        nodeQueryLoading && (
          <LoaderAndError
            error={nodeQueryError}
            loading={nodeQueryLoading}
            loaderText="Waiting for transaction to come in..."
          />
        )}

      {transaction && (
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
                  {transaction.badResult && (
                    <Notification
                      intent="negative"
                      icon={<SystemIcon.Close />}
                      role="status"
                    >
                      Transaction failed with status:{' '}
                      <pre>
                        {JSON.stringify(
                          JSON.parse(transaction.badResult),
                          null,
                          4,
                        )}
                      </pre>
                    </Notification>
                  )}
                  {transaction.goodResult && (
                    <Notification
                      intent="positive"
                      icon={<SystemIcon.Check />}
                      role="status"
                    >
                      Transaction succeeded with status:
                      <br />
                      <pre>{formatCode(transaction.goodResult)}</pre>
                    </Notification>
                  )}
                  {!transaction.goodResult && !transaction.badResult && (
                    <Notification intent="warning" role="status">
                      Unknown transaction status
                    </Notification>
                  )}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Request Key</strong>
                </Table.Td>
                <Table.Td>{transaction.requestKey}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain</strong>
                </Table.Td>
                <Table.Td>{transaction.chainId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Block</strong>
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.BLOCK_OVERVIEW}/${transaction.block?.hash}`}
                  >
                    {transaction.block?.hash}
                  </Link>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Code</strong>
                </Table.Td>
                <Table.Td>
                  <pre>{formatLisp(JSON.parse(transaction.code))}</pre>
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
                        <Table.Td>{transaction.gas}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Result</strong>
                        </Table.Td>
                        <Table.Td>
                          <pre>
                            {transaction.goodResult
                              ? formatCode(transaction.goodResult)
                              : transaction.badResult
                              ? formatCode(transaction.badResult)
                              : 'Unknown'}
                          </pre>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Logs</strong>
                        </Table.Td>
                        <Table.Td>{transaction.logs}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Metadata</strong>
                        </Table.Td>
                        <Table.Td>{transaction.metadata}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Continuation</strong>
                        </Table.Td>
                        <Table.Td>
                          <pre>
                            {transaction.continuation
                              ? formatCode(transaction.continuation)
                              : 'None'}
                          </pre>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Transaction ID</strong>
                        </Table.Td>
                        <Table.Td>{transaction.transactionId}</Table.Td>
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
                  {transaction.events?.map((event, index) => (
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
                    {transaction.data &&
                      JSON.stringify(JSON.parse(transaction.data), null, 4)}
                  </pre>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Nonce</strong>
                </Table.Td>
                <Table.Td>
                  <pre>{transaction.nonce}</pre>
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
                        <Table.Td>{transaction.chainId}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Sender</strong>
                        </Table.Td>
                        <Table.Td>{transaction.senderAccount}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Gas Price</strong>
                        </Table.Td>
                        <Table.Td>{transaction.gasPrice}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Gas Limit</strong>
                        </Table.Td>
                        <Table.Td>{transaction.gasLimit}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>TTL</strong>
                        </Table.Td>
                        <Table.Td>{transaction.ttl}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Creation Time</strong>
                        </Table.Td>
                        <Table.Td>{transaction.creationTime}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Height</strong>
                        </Table.Td>
                        <Table.Td>{transaction.height}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Pact ID</strong>
                        </Table.Td>
                        <Table.Td>{transaction.pactId}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Proof</strong>
                        </Table.Td>
                        <Table.Td>{transaction.proof}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Rollback</strong>
                        </Table.Td>
                        <Table.Td>{transaction.rollback}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Step</strong>
                        </Table.Td>
                        <Table.Td>{transaction.step}</Table.Td>
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
                  {transaction.signers
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
                  {transaction.signers
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
