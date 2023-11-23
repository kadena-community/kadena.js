import type { GetAccountQuery } from '@/__generated__/sdk';
import routes from '@constants/routes';
import { Box, ContentHeader, Link, Table } from '@kadena/react-ui';
import React from 'react';

interface IChainModuleAccountTableProps {
  moduleName: string;
  accountName: string;
  chainAccounts: GetAccountQuery['account']['chainAccounts'];
}
export const ChainModuleAccountTable = (
  props: IChainModuleAccountTableProps,
): JSX.Element => {
  const { moduleName, accountName, chainAccounts } = props;

  return (
    <>
      <ContentHeader
        heading="Chain Accounts"
        icon="Link"
        description="All chains where this account was found"
      />
      <Box margin={'$4'} />
      <Table.Root wordBreak="break-all">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Balance</Table.Th>
            <Table.Th>Guard Predicate</Table.Th>
            <Table.Th>Guard Keys</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {chainAccounts.map((chainAccount, index) => (
            <Table.Tr key={index}>
              <Table.Td>{chainAccount.chainId}</Table.Td>
              <Table.Td>
                <Link
                  href={`${routes.ACCOUNT}/${moduleName}/${accountName}/${chainAccount.chainId}`}
                >
                  {chainAccount.balance}
                </Link>
              </Table.Td>
              <Table.Td>{chainAccount.guard.predicate}</Table.Td>
              <Table.Td>{chainAccount.guard.keys.join(', ')}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};
