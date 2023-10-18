import { Link, Table } from '@kadena/react-ui';

import type { GetAccountQuery } from '@/__generated__/sdk';
import routes from '@constants/routes';
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
    <Table.Root wordBreak="break-all">
      <Table.Body>
        <Table.Tr>
          <Table.Td>
            <strong>Chain</strong>
          </Table.Td>
          {chainAccounts.map((chainAccount, index) => (
            <Table.Td key={index}>{chainAccount.chainId}</Table.Td>
          ))}
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <strong>Balance</strong>
          </Table.Td>
          {chainAccounts.map((chainAccount, index) => (
            <Table.Td key={index}>
              <Link
                href={`${routes.ACCOUNT}/${moduleName}/${accountName}/${chainAccount.chainId}`}
              >
                {chainAccount.balance}
              </Link>
            </Table.Td>
          ))}
        </Table.Tr>
      </Table.Body>
    </Table.Root>
  );
};
