import { useGetNonFungibleAccountQuery } from '@/__generated__/sdk';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { Box, Breadcrumbs, Notification, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';

const NonFungibleAccount: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetNonFungibleAccountQuery({
    variables: {
      accountName: router.query.account as string,
    },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Account Overview</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {data?.nonFungibleAccount &&
        data?.nonFungibleAccount?.chainAccounts.length === 0 && (
          <>
            <Notification intent="info" role="status">
              We could not find any data on this account. Please check the
              account name.
            </Notification>
            <Box margin={'$4'} />
          </>
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
                    <Box key={chainAccount.chainId}>{chainAccount.chainId}</Box>
                  ))}
                </Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
        </div>
      )}
    </>
  );
};

export default NonFungibleAccount;
