import { useGetTransactionByRequestKeySubscription } from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { getTransactionByRequestKey } from '@/graphql/subscriptions.graph';
import { formatCode, formatLisp } from '@/utils/formatter';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Cell,
  Column,
  Link,
  Notification,
  Row,
  Stack,
  SystemIcon,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
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

  const transaction = transactionSubscriptionData?.transaction;

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
        transactionSubscriptionLoading && (
          <LoaderAndError
            error={transactionSubscriptionError}
            loading={transactionSubscriptionLoading}
            loaderText="Waiting for transaction to come in..."
          />
        )}

      {transaction && (
        <>
          <Table
            isStriped
            isCompact
            className={atoms({ wordBreak: 'break-word' })}
          >
            <TableHeader>
              <Column width="160">Key</Column>
              <Column>Value</Column>
            </TableHeader>
            <TableBody>
              <Row>
                <Cell>
                  <strong>Status</strong>
                </Cell>
                <Cell>
                  {transaction.result.badResult && (
                    <Notification
                      intent="negative"
                      icon={<SystemIcon.Close />}
                      role="status"
                    >
                      Transaction failed with status:{' '}
                      <pre>
                        {JSON.stringify(
                          JSON.parse(transaction.result.badResult),
                          null,
                          4,
                        )}
                      </pre>
                    </Notification>
                  )}
                  {transaction.result.goodResult && (
                    <Notification
                      intent="positive"
                      icon={<SystemIcon.Check />}
                      role="status"
                    >
                      Transaction succeeded with status:
                      <br />
                      <pre>{formatCode(transaction.result.goodResult)}</pre>
                    </Notification>
                  )}
                  {!transaction.result.goodResult &&
                    !transaction.result.badResult && (
                      <Notification intent="warning" role="status">
                        Unknown transaction status
                      </Notification>
                    )}
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Request Key</strong>
                </Cell>
                <Cell>{transaction.hash}</Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Chain</strong>
                </Cell>
                <Cell>{transaction.cmd.meta.chainId}</Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Block</strong>
                </Cell>
                <Cell>
                  <Link
                    href={`${routes.BLOCK_OVERVIEW}/${transaction.block?.hash}`}
                  >
                    {transaction.block?.hash}
                  </Link>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Code</strong>
                </Cell>
                <Cell>
                  <pre>
                    {transaction.cmd.payload.__typename === 'ExecPayload' &&
                    transaction.cmd.payload.code
                      ? formatLisp(JSON.parse(transaction.cmd.payload.code))
                      : 'Cont'}
                  </pre>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Transaction Output</strong>
                </Cell>
                <Cell>
                  <Table>
                    <TableHeader>
                      <Column>Label</Column>
                      <Column>Value</Column>
                    </TableHeader>
                    <TableBody>
                      <Row>
                        <Cell>
                          <strong>Gas</strong>
                        </Cell>
                        <Cell>{transaction.result.gas}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Result</strong>
                        </Cell>
                        <Cell>
                          <pre>
                            {transaction.result.goodResult
                              ? formatCode(transaction.result.goodResult)
                              : transaction.result.badResult
                              ? formatCode(transaction.result.badResult)
                              : 'Unknown'}
                          </pre>
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Logs</strong>
                        </Cell>
                        <Cell>{transaction.result.logs}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Metadata</strong>
                        </Cell>
                        <Cell>{transaction.result.metadata}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Continuation</strong>
                        </Cell>
                        <Cell>
                          <pre>
                            {transaction.result.continuation
                              ? formatCode(transaction.result.continuation)
                              : 'None'}
                          </pre>
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Transaction ID</strong>
                        </Cell>
                        <Cell>{transaction.result.transactionId}</Cell>
                      </Row>
                    </TableBody>
                  </Table>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Events</strong>
                </Cell>
                <Cell>
                  {transaction.events?.map((event, index) => (
                    <Table key={index}>
                      <TableHeader>
                        <Column>Label</Column>
                        <Column>Value</Column>
                      </TableHeader>
                      <TableBody>
                        <Row>
                          <Cell>
                            <strong>Name</strong>
                          </Cell>
                          <Cell>{event.qualifiedName}</Cell>
                        </Row>
                        <Row>
                          <Cell>
                            <strong>Parameters</strong>
                          </Cell>
                          <Cell>
                            <pre>{formatCode(event.parameterText)}</pre>
                          </Cell>
                        </Row>
                      </TableBody>
                    </Table>
                  ))}
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Data</strong>
                </Cell>
                <Cell>
                  <pre>
                    {/* {transaction.cmd.payload.data &&
                      JSON.stringify(JSON.parse(transaction.cmd.payload.data), null, 4)} */}
                    {JSON.stringify(
                      JSON.parse(transaction.cmd.payload.data),
                      null,
                      4,
                    )}
                  </pre>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Nonce</strong>
                </Cell>
                <Cell>
                  <pre>{transaction.cmd.nonce}</pre>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Meta</strong>
                </Cell>
                <Cell>
                  <Table>
                    <TableHeader>
                      <Column width="100">Label</Column>
                      <Column>Value</Column>
                    </TableHeader>
                    <TableBody>
                      <Row>
                        <Cell>
                          <strong>Chain</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.chainId}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Sender</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.sender}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Gas Price</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.gasPrice}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Gas Limit</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.gasLimit}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>TTL</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.ttl}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Creation Time</strong>
                        </Cell>
                        <Cell>{transaction.cmd.meta.creationTime}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Height</strong>
                        </Cell>
                        <Cell>{transaction.result.height}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Pact ID</strong>
                        </Cell>
                        <Cell>
                          {transaction.cmd.payload.__typename === 'ContPayload'
                            ? transaction.cmd.payload.pactId
                            : ''}
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Proof</strong>
                        </Cell>
                        <Cell>
                          {transaction.cmd.payload.__typename === 'ContPayload'
                            ? transaction.cmd.payload.proof
                            : ''}
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Rollback</strong>
                        </Cell>
                        <Cell>
                          {transaction.cmd.payload.__typename === 'ContPayload'
                            ? transaction.cmd.payload.rollback
                            : ''}
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Step</strong>
                        </Cell>
                        <Cell>
                          {transaction.cmd.payload.__typename === 'ContPayload'
                            ? transaction.cmd.payload.step
                            : ''}
                        </Cell>
                      </Row>
                    </TableBody>
                  </Table>
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Signers</strong>
                </Cell>
                <Cell>
                  {transaction.cmd.signers
                    ?.map((signer) => {
                      return signer.publicKey;
                    })
                    .join(', ')}
                </Cell>
              </Row>
              <Row>
                <Cell>
                  <strong>Signatures</strong>
                </Cell>
                <Cell>
                  {transaction.cmd.signers
                    ?.map((signer) => {
                      return signer.signature;
                    })
                    .join(', ')}
                </Cell>
              </Row>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default RequestKey;
