import type { FungibleChainAccount } from '@/__generated__/sdk';
import routes from '@constants/routes';
import { MonoLink } from '@kadena/kode-icons/system';
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
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import React from 'react';

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
        icon={<MonoLink />}
        description="All chains where this account was found"
      />
      <Box margin="md" />
      <Table className={atoms({ wordBreak: 'break-all' })} isCompact>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Balance</Column>
          <Column>Guard Predicate</Column>
          <Column>Guard Keys</Column>
        </TableHeader>
        <TableBody>
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
