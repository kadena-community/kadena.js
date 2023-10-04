import {
  Box,
  ContentHeader,
  Grid,
  Link,
  Notification,
  Table,
} from '@kadena/react-ui';

import { useGetAccountQuery } from '../../../__generated__/sdk';
import Loader from '../../../components/loader/loader';
import { mainStyle } from '../../../components/main/styles.css';
import { Text } from '../../../components/text';
import routes from '../../../constants/routes';

import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

function truncate(text: string): string {
  if (text.length > 12) {
    return `${text.replace(/(\w{4}).*(\w{4})/, '$1****$2')}`;
  }

  return text;
}

const Account: React.FC = () => {
  const router = useRouter();

  const {
    loading: loadingAccount,
    data: accountQuery,
    error,
  } = useGetAccountQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
    },
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
          {loadingAccount && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving account information...</span>
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
          {accountQuery?.account && (
            <div>
              <Table.Root>
                <Table.Body>
                  <Table.Tr>
                    <Table.Td><strong>Account Name</strong></Table.Td>
                    <Table.Td>{accountQuery.account.accountName}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><strong>Module</strong></Table.Td>
                    <Table.Td>{accountQuery.account.moduleName}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><strong>Balance</strong></Table.Td>
                    <Table.Td>{accountQuery.account.totalBalance}</Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <Box margin={'$4'} />
              <Table.Root>
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Chain</strong>
                    </Table.Td>
                    {accountQuery.account.chainAccounts.map(
                      (chainAccount, index) => (
                        <Table.Td key={index}>{chainAccount.chainId}</Table.Td>
                      ),
                    )}
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Balance</strong>
                    </Table.Td>
                    {accountQuery.account.chainAccounts.map(
                      (chainAccount, index) => (
                        <Table.Td key={index}>
                          <Link
                            href={`${routes.ACCOUNT}/${router.query.module}/${router.query.account}/${chainAccount.chainId}`}
                          >
                            {chainAccount.balance}
                          </Link>
                        </Table.Td>
                      ),
                    )}
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <Box margin={'$8'} />
              <Grid.Root columns={2} gap="$lg">
                <Grid.Item>
                  <ContentHeader
                    heading="Transfers"
                    icon="KIcon"
                    description="All transfers from this fungible."
                  />
                  <Box margin={'$4'} />
                  <Table.Root wordBreak="break-word">
                    <Table.Head>
                      <Table.Tr>
                        <Table.Th>Chain</Table.Th>
                        <Table.Th>Block Height</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>From Account</Table.Th>
                        <Table.Th>To Account</Table.Th>
                        <Table.Th>Request key</Table.Th>
                      </Table.Tr>
                    </Table.Head>
                    <Table.Body>
                      {accountQuery.account.transfers.edges.map(
                        (edge, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td>{edge?.node.chainId}</Table.Td>
                              <Table.Td>{edge?.node.height}</Table.Td>
                              <Table.Td>{edge?.node.amount}</Table.Td>
                              <Table.Td>
                                <span title={edge?.node.fromAccount}>
                                  {truncate(edge?.node.fromAccount as string)}
                                </span>
                              </Table.Td>
                              <Table.Td>
                                <span title={edge?.node.toAccount}>
                                  {truncate(edge?.node.toAccount as string)}
                                </span>
                              </Table.Td>
                              <Table.Td>
                                <Link
                                  href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}
                                >
                                  {edge?.node.requestKey}
                                </Link>
                              </Table.Td>
                            </Table.Tr>
                          );
                        },
                      )}
                    </Table.Body>
                  </Table.Root>
                </Grid.Item>
                <Grid.Item>
                  <ContentHeader
                    heading="Transactions"
                    icon="KIcon"
                    description="All transactions where this account is the initiator."
                  />
                  <Box margin={'$4'} />
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
                      {accountQuery.account.transactions.edges.map(
                        (edge, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td>{edge?.node.chainId}</Table.Td>
                              <Table.Td>{edge?.node.creationTime}</Table.Td>
                              <Table.Td>{edge?.node.height}</Table.Td>
                              <Table.Td>
                                <Link
                                  href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}
                                >
                                  {edge?.node.requestKey}
                                </Link>
                              </Table.Td>
                              <Table.Td>
                                <span title={edge?.node.code as string}>
                                  {truncate(edge?.node.code as string)}
                                </span>
                              </Table.Td>
                            </Table.Tr>
                          );
                        },
                      )}
                    </Table.Body>
                  </Table.Root>
                </Grid.Item>
              </Grid.Root>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Account;
