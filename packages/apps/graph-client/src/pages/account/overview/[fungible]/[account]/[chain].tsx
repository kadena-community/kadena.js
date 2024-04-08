import type {
  FungibleChainAccountTransactionsConnection,
  FungibleChainAccountTransfersConnection,
  NonFungibleChainAccountTransactionsConnection,
  NonFungibleTokenBalance,
} from '@/__generated__/sdk';
import {
  useGetFungibleChainAccountQuery,
  useGetNonFungibleChainAccountQuery,
} from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { TokenTable } from '@/components/token-table/token-table';
import { NON_FUNGIBLE_TRANSACTION } from '@/constants/non-fungible';
import {
  getFungibleChainAccount,
  getNonFungibleChainAccount,
} from '@/graphql/queries.graph';
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
  Grid,
  GridItem,
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

const ChainAccount: React.FC = () => {
  const router = useRouter();

  const [fungibleField, setFungibleField] = useState<string>('');

  const fungibleChainAccountVariables = {
    fungibleName: router.query.fungible as string,
    accountName: router.query.account as string,
    chainId: router.query.chain as string,
  };

  const {
    loading: fungibleChainAccountLoading,
    data: fungibleChainAccountData,
    error: fungibleChainAccountError,
  } = useGetFungibleChainAccountQuery({
    variables: fungibleChainAccountVariables,
    skip:
      !router.query.fungible || !router.query.account || !router.query.chain,
  });

  const nonFungibleChainAccountVariables = {
    accountName: router.query.account as string,
    chainId: router.query.chain as string,
  };

  const {
    loading: nonFungibleChainAccountLoading,
    data: nonFungibleChainAccountData,
    error: nonFungibleChainAccountError,
  } = useGetNonFungibleChainAccountQuery({
    variables: nonFungibleChainAccountVariables,
    skip: !router.query.account || !router.query.chain,
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
          <BreadcrumbsItem
            href={`${routes.ACCOUNT}/${router.query.fungible as string}/${
              router.query.account as string
            }`}
          >
            Account Overview
          </BreadcrumbsItem>
          <BreadcrumbsItem>Chain</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[
            {
              query: getFungibleChainAccount,
              variables: fungibleChainAccountVariables,
            },
            {
              query: getNonFungibleChainAccount,
              variables: nonFungibleChainAccountVariables,
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
          <Row>
            <Cell>
              <strong>Chain</strong>
            </Cell>
            <Cell>{router.query.chain}</Cell>
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

            <Button onPress={search}>Search</Button>
          </Box>

          <Box margin="sm" />

          <LoaderAndError
            error={fungibleChainAccountError}
            loading={fungibleChainAccountLoading}
            loaderText="Retrieving account information..."
          />

          {!fungibleChainAccountLoading &&
            !fungibleChainAccountError &&
            !fungibleChainAccountData?.fungibleChainAccount && (
              <Notification intent="info" role="status">
                We could not find any data on this account. Please check the
                fungible name, account name and chain.
              </Notification>
            )}

          {fungibleChainAccountData?.fungibleChainAccount && (
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
                      {
                        fungibleChainAccountData.fungibleChainAccount
                          .fungibleName
                      }
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <strong>Balance</strong>
                    </Cell>
                    <Cell>
                      {fungibleChainAccountData.fungibleChainAccount.balance}
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <strong>Guard Predicate</strong>
                    </Cell>
                    <Cell>
                      {
                        fungibleChainAccountData.fungibleChainAccount.guard
                          .predicate
                      }
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <strong>Guard Keys</strong>
                    </Cell>
                    <Cell>
                      {fungibleChainAccountData.fungibleChainAccount.guard.keys}
                    </Cell>
                  </Row>
                </TableBody>
              </Table>

              <Box margin="md" />

              <Grid columns={2} gap="lg">
                <GridItem>
                  <CompactTransfersTable
                    fungibleName={router.query.fungible as string}
                    accountName={router.query.account as string}
                    chainId={router.query.chain as string}
                    truncateColumns={true}
                    transfers={
                      fungibleChainAccountData.fungibleChainAccount
                        .transfers as FungibleChainAccountTransfersConnection
                    }
                  />
                </GridItem>
                <GridItem>
                  <CompactTransactionsTable
                    viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                      router.query.fungible as string
                    }/${router.query.account as string}?chain=${
                      router.query.chain as string
                    }`}
                    truncateColumns={true}
                    transactions={
                      fungibleChainAccountData.fungibleChainAccount
                        .transactions as FungibleChainAccountTransactionsConnection
                    }
                  />
                </GridItem>
              </Grid>
            </>
          )}
        </TabItem>
        <TabItem title="Non-Fungible" key="Non-Fungible">
          <Box margin="sm" />

          <LoaderAndError
            error={nonFungibleChainAccountError}
            loading={nonFungibleChainAccountLoading}
            loaderText="Retrieving account information..."
          />

          {!nonFungibleChainAccountLoading &&
            !nonFungibleChainAccountError &&
            !nonFungibleChainAccountData?.nonFungibleChainAccount && (
              <Notification intent="info" role="status">
                We could not find any data on this account. Please check the
                account name and chain.
              </Notification>
            )}

          {nonFungibleChainAccountData?.nonFungibleChainAccount && (
            <>
              <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
                <TableHeader>
                  <Column>Label</Column>
                  <Column>Value</Column>
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <strong>Guard Predicate</strong>
                    </Cell>
                    <Cell>
                      nonFungibleChainAccountData.nonFungibleChainAccount
                      .guard.predicate
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <strong>Guard Keys</strong>
                    </Cell>
                    <Cell>
                      nonFungibleChainAccountData.nonFungibleChainAccount
                      .guard.keys
                    </Cell>
                  </Row>
                </TableBody>
              </Table>

              <Box margin="md" />

              <Grid columns={2} gap="lg">
                <GridItem>
                  <TokenTable
                    tokens={
                      nonFungibleChainAccountData.nonFungibleChainAccount
                        .nonFungibleTokenBalances as NonFungibleTokenBalance[]
                    }
                  />
                </GridItem>
                <GridItem>
                  <CompactTransactionsTable
                    viewAllHref={`${
                      routes.ACCOUNT_TRANSACTIONS
                    }/${NON_FUNGIBLE_TRANSACTION}/${
                      router.query.account as string
                    }?chain=${router.query.chain as string}`}
                    truncateColumns={true}
                    transactions={
                      nonFungibleChainAccountData.nonFungibleChainAccount
                        .transactions as NonFungibleChainAccountTransactionsConnection
                    }
                  />
                </GridItem>
              </Grid>
            </>
          )}
        </TabItem>
      </Tabs>
    </>
  );
};

export default ChainAccount;
