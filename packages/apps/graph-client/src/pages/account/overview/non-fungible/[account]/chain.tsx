import {
  ChainNonFungibleAccountTransactionsConnection,
  useGetChainNonFungibleAccountQuery,
} from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { TokenTable } from '@/components/token-table/token-table';
import routes from '@/constants/routes';
import { getChainNonFungibleAccount } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs,
  Grid,
  GridItem,
  Stack,
  Table,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';

const ChainFungibleAccount: React.FC = () => {
  const router = useRouter();

  const variables = {
    accountName: router.query.account as string,
    chainId: router.query.chain as string,
  };

  const { loading, data, error } = useGetChainNonFungibleAccountQuery({
    variables,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs.Root>
          <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item
            href={`${routes.ACCOUNT}/${router.query.fungible as string}/${
              router.query.account as string
            }`}
          >
            Account Overview
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>Chain</Breadcrumbs.Item>
        </Breadcrumbs.Root>
        <GraphQLQueryDialog
          queries={[{ query: getChainNonFungibleAccount, variables }]}
        />
      </Stack>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {data?.chainNonFungibleAccount && (
        <>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.chainNonFungibleAccount.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain</strong>
                </Table.Td>
                <Table.Td>{data.chainNonFungibleAccount.chainId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Predicate</strong>
                </Table.Td>
                <Table.Td>
                  {data.chainNonFungibleAccount.guard.predicate}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Keys</strong>
                </Table.Td>
                <Table.Td>{data.chainNonFungibleAccount.guard.keys}</Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
          <Grid columns={2} gap="$lg">
            <GridItem>
              <TokenTable tokens={data.chainNonFungibleAccount.nonFungibles} />
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
                  data.chainNonFungibleAccount
                    .transactions as ChainNonFungibleAccountTransactionsConnection
                }
              />
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
};

export default ChainFungibleAccount;
