import type { FungibleChainAccount } from '@/__generated__/sdk';
import routes from '@constants/routes';
import {
  Box,
  Cell,
  Column,
  ContentHeader,
  Link,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';
import { compactTableClass } from '../common/compact-table/compact-table.css';

interface IFungibleChainAccountTableProps {
  fungibleName: string;
  accountName: string;
  chainAccounts: FungibleChainAccount[];
}
export const FungibleChainAccountTable = (
  props: IFungibleChainAccountTableProps,
): JSX.Element => {
  const { fungibleName, accountName, chainAccounts } = props;

  return (
    <>
      <ContentHeader
        heading="Chain Accounts"
        icon="Link"
        description="All chains where this account was found"
      />
      <Box margin="md" />
<<<<<<< HEAD
      <Table.Root wordBreak="break-all" className={compactTableClass}>
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Balance</Table.Th>
            <Table.Th>Guard Predicate</Table.Th>
            <Table.Th>Guard Keys</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
=======
      <Table className={atoms({ wordBreak: 'break-all' })}>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Balance</Column>
          <Column>Guard Predicate</Column>
          <Column>Guard Keys</Column>
        </TableHeader>
        <TableBody>
>>>>>>> 0e5aaafd1 (updated tools)
          {chainAccounts.map((chainAccount, index) => (
            <Row key={index}>
              <Cell>{chainAccount.chainId}</Cell>
              <Cell>
                <Link
                  href={`${routes.ACCOUNT}/${fungibleName}/${accountName}/${chainAccount.chainId}`}
                >
                  {chainAccount.balance}
                </Link>
              </Cell>
              <Cell>{chainAccount.guard.predicate}</Cell>
              <Cell>{chainAccount.guard.keys.join(', ')}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
