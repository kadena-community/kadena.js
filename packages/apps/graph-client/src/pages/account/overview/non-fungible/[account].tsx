import type { NonFungibleAccountTransactionsConnection } from '@/__generated__/sdk';
import { useGetNonFungibleAccountQuery } from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { TokenTable } from '@/components/token-table/token-table';
import { NON_FUNGIBLE_TRANSACTION } from '@/constants/non-fungible';
import routes from '@/constants/routes';
import { getNonFungibleAccount } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Link,
  Notification,
  Stack,
  TabItem,
  Table,
  Tabs,
} from '@kadena/react-ui';
import { sprinkles } from '@kadena/react-ui/theme';
import { useRouter } from 'next/router';
import React from 'react';

const NonFungibleAccount: React.FC = () => {
  const router = useRouter();

  const variables = {
    accountName: router.query.account as string,
  };

  const { loading, data, error } = useGetNonFungibleAccountQuery({
    variables,
    skip: !router.query.account,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem>Account Overview</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[{ query: getNonFungibleAccount, variables }]}
        />
      </Stack>

      <Box className={sprinkles({ marginBlockEnd: '$8' })} />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {((data?.nonFungibleAccount &&
        data?.nonFungibleAccount?.chainAccounts.length === 0) ||
        (!loading && !error && !data?.nonFungibleAccount)) && (
        <Notification intent="info" role="status">
          We could not find any data on this account. Please check the account
          name.
        </Notification>
      )}

      {data?.nonFungibleAccount && (
        <div>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.nonFungibleAccount.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain Accounts</strong>
                </Table.Td>
                <Table.Td>
                  {data.nonFungibleAccount.chainAccounts.map((chainAccount) => (
                    <Box key={chainAccount.chainId}>
                      <Link
                        href={`${routes.NON_FUNGIBLE_ACCOUNT}/${data.nonFungibleAccount?.accountName}/${chainAccount.chainId}`}
                      >
                        {chainAccount.chainId}
                      </Link>
                    </Box>
                  ))}
                </Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
          <Box margin="md" />
          <Tabs defaultSelectedKey="Tokens">
            <TabItem title="Tokens" key="Tokens">
              <Box margin="sm" />
              <TokenTable tokens={data.nonFungibleAccount.nonFungibles} />
            </TabItem>
            <TabItem title="Transactions" key="Transactions">
              <Box margin="sm" />
              <CompactTransactionsTable
                viewAllHref={`${
                  routes.ACCOUNT_TRANSACTIONS
                }/${NON_FUNGIBLE_TRANSACTION}/${
                  router.query.account as string
                }`}
                transactions={
                  data.nonFungibleAccount
                    .transactions as NonFungibleAccountTransactionsConnection
                }
              />
            </TabItem>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default NonFungibleAccount;
