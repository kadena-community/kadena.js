import type {
  FungibleAccountTransactionsConnection,
  FungibleAccountTransfersConnection,
  FungibleChainAccount,
  NonFungibleAccountTransactionsConnection,
  Token,
} from '@/__generated__/sdk';
import {
  useGetFungibleAccountQuery,
  useGetNonFungibleAccountQuery,
} from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { TokenTable } from '@/components/token-table/token-table';
import { NON_FUNGIBLE_TRANSACTION } from '@/constants/non-fungible';
import {
  getFungibleAccount,
  getNonFungibleAccount,
} from '@/graphql/queries.graph';
import { FungibleChainAccountTable } from '@components/chain-fungible-account-table/chain-fungible-account-table';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Cell,
  Column,
  Link,
  Notification,
  Row,
  Stack,
  TabItem,
  Table,
  TableBody,
  TableHeader,
  Tabs,
  TextField,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Account: React.FC = () => {
  const router = useRouter();

  const [fungibleField, setFungibleField] = useState<string>('');

  const fungibleAccountVariables = {
    fungibleName: router.query.fungible as string,
    accountName: router.query.account as string,
  };

  const {
    loading: fungibleAccountLoading,
    data: fungibleAccountData,
    error: fungibleAccountError,
  } = useGetFungibleAccountQuery({
    variables: fungibleAccountVariables,
    skip: !router.query.fungible || !router.query.account,
  });

  const nonFungibleAccountVariables = {
    accountName: router.query.account as string,
  };

  const {
    loading: nonFungibleAccountLoading,
    data: nonFungibleAccountData,
    error: nonFungibleAccountError,
  } = useGetNonFungibleAccountQuery({
    variables: nonFungibleAccountVariables,
    skip: !router.query.account,
  });

  const search = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(`${routes.ACCOUNT}/${fungibleField}/${router.query.account}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    if (router.query.fungible) {
      setFungibleField(router.query.fungible as string);
    }
  }, [router.query.fungible]);

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem>Account Overview</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[
            {
              query: getFungibleAccount,
              variables: fungibleAccountVariables,
            },
            {
              query: getNonFungibleAccount,
              variables: nonFungibleAccountVariables,
            },
          ]}
        />
      </Stack>

      <Box margin="md" />

      <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
        <TableHeader>
          <Column>Label</Column>
          <Column>Value</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>
              <strong>Account Name</strong>
            </Cell>
            <Cell>{router.query.account}</Cell>
          </Row>
        </TableBody>
      </Table>

      <Box margin="md" />

      <Tabs defaultSelectedKey="Fungible">
        <TabItem title="Fungible" key="Fungible">
          <Box margin="sm" />

          <Box
            display="flex"
            gap="sm"
            alignItems="flex-end"
            marginBlockEnd="lg"
          >
            <TextField
              label="Fungible"
              value={fungibleField}
              onValueChange={(value) => setFungibleField(value)}
              placeholder="coin"
              onKeyDown={handleKeyPress}
            />

            <Button onClick={search}>Search</Button>
          </Box>

          <Box margin="sm" />

          <LoaderAndError
            error={fungibleAccountError}
            loading={fungibleAccountLoading}
            loaderText="Retrieving account information..."
          />

          {((fungibleAccountData?.fungibleAccount &&
            fungibleAccountData?.fungibleAccount?.totalBalance === 0 &&
            fungibleAccountData?.fungibleAccount?.chainAccounts.length === 0) ||
            (!fungibleAccountLoading &&
              !fungibleAccountError &&
              !fungibleAccountData?.fungibleAccount)) && (
            <Notification intent="info" role="status">
              We could not find any data on this account. Please check the
              fungible name and account name.
            </Notification>
          )}
          {fungibleAccountData?.fungibleAccount && (
            <>
              <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
                <TableHeader>
                  <Column>Label</Column>
                  <Column>Value</Column>
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <strong>Fungible</strong>
                    </Cell>
                    <Cell>
                      {fungibleAccountData.fungibleAccount.fungibleName}
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <strong>Balance</strong>
                    </Cell>
                    <Cell>
                      {fungibleAccountData.fungibleAccount.totalBalance}
                    </Cell>
                  </Row>
                </TableBody>
              </Table>

              <Box margin="md" />

              <Tabs defaultSelectedKey="Chain Accounts">
                <TabItem title="Chain Accounts" key="Chain Accounts">
                  <Box margin="sm" />
                  <FungibleChainAccountTable
                    fungibleName={router.query.fungible as string}
                    accountName={router.query.account as string}
                    chainAccounts={
                      fungibleAccountData.fungibleAccount
                        .chainAccounts as FungibleChainAccount[]
                    }
                  />
                </TabItem>

                <TabItem title="Transfers" key="Transfers">
                  <Box margin="sm" />
                  <CompactTransfersTable
                    description="All transfers from or to this account"
                    fungibleName={router.query.fungible as string}
                    accountName={router.query.account as string}
                    transfers={
                      fungibleAccountData.fungibleAccount
                        .transfers as FungibleAccountTransfersConnection
                    }
                  />
                </TabItem>
                <TabItem title="Transactions" key="Transactions">
                  <Box margin="sm" />
                  <CompactTransactionsTable
                    viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                      router.query.fungible as string
                    }/${router.query.account as string}`}
                    transactions={
                      fungibleAccountData.fungibleAccount
                        .transactions as FungibleAccountTransactionsConnection
                    }
                  />
                </TabItem>
              </Tabs>
            </>
          )}
        </TabItem>
        <TabItem title="Non-Fungible" key="Non-Fungible">
          <Box margin="sm" />

          <LoaderAndError
            error={nonFungibleAccountError}
            loading={nonFungibleAccountLoading}
            loaderText="Retrieving account information..."
          />

          {((nonFungibleAccountData?.nonFungibleAccount &&
            nonFungibleAccountData?.nonFungibleAccount?.chainAccounts.length ===
              0) ||
            (!nonFungibleAccountLoading &&
              !nonFungibleAccountError &&
              !nonFungibleAccountData?.nonFungibleAccount)) && (
            <Notification intent="info" role="status">
              We could not find any data on this account. Please check the
              account name.
            </Notification>
          )}

          {nonFungibleAccountData?.nonFungibleAccount && (
            <div>
              <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
                <TableHeader>
                  <Column>Label</Column>
                  <Column>Value</Column>
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <strong>Chain Accounts</strong>
                    </Cell>
                    <Cell>
                      {nonFungibleAccountData.nonFungibleAccount.chainAccounts.map(
                        (chainAccount) => (
                          <Box key={chainAccount.chainId}>
                            <Link
                              href={`${routes.ACCOUNT}/${router.query.fungible}/${router.query.account}/${chainAccount.chainId}`}
                            >
                              {chainAccount.chainId}
                            </Link>
                          </Box>
                        ),
                      )}
                    </Cell>
                  </Row>
                </TableBody>
              </Table>

              <Box margin="md" />

              <Tabs defaultSelectedKey="Tokens">
                <TabItem title="Tokens" key="Tokens">
                  <Box margin="sm" />
                  <TokenTable
                    tokens={
                      nonFungibleAccountData.nonFungibleAccount
                        .nonFungibles as Token[]
                    }
                  />
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
                      nonFungibleAccountData.nonFungibleAccount
                        .transactions as NonFungibleAccountTransactionsConnection
                    }
                  />
                </TabItem>
              </Tabs>
            </div>
          )}
        </TabItem>
      </Tabs>
    </>
  );
};

export default Account;
