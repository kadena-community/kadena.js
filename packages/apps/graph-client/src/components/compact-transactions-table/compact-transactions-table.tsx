import type {
  BlockTransactionsConnection,
  FungibleAccountTransactionsConnection,
  FungibleChainAccountTransactionsConnection,
  NonFungibleAccountTransactionsConnection,
  NonFungibleChainAccountTransactionsConnection,
  QueryTransactionsConnection,
} from '@/__generated__/sdk';
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
import { truncate } from '@utils/truncate';
import React from 'react';
import { compactTableClass } from '../common/compact-table/compact-table.css';

interface ICompactTransactionsTableProps {
  viewAllHref?: string;
  description?: string;
  truncateColumns?: boolean;
  transactions:
    | FungibleAccountTransactionsConnection
    | FungibleChainAccountTransactionsConnection
    | BlockTransactionsConnection
    | QueryTransactionsConnection
    | NonFungibleAccountTransactionsConnection
    | NonFungibleChainAccountTransactionsConnection;
}

export const CompactTransactionsTable = (
  props: ICompactTransactionsTableProps,
): JSX.Element => {
  const { viewAllHref, description, truncateColumns, transactions } = props;

  return (
    <>
      <ContentHeader
        heading="Transactions"
        icon="KIcon"
        description={
          description
            ? description
            : 'All transactions where this account is the initiator'
        }
      />
      <Box margin="sm" />
      <Link isCompact href={viewAllHref}>
        View all transactions
      </Link>
      <Box margin="xs" />
<<<<<<< HEAD
      <Table.Root wordBreak="break-word" className={compactTableClass}>
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
=======
      <Table className={atoms({ wordBreak: 'break-all' })}>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Timestamp</Column>
          <Column>Block Height</Column>
          <Column>Request Key</Column>
          <Column>Code</Column>
        </TableHeader>
        <TableBody>
>>>>>>> 0e5aaafd1 (updated tools)
          {transactions.edges.slice(0, 10).map((edge, index) => {
            return (
              <Row key={index}>
                <Cell>{edge.node.chainId}</Cell>
                <Cell>{new Date(edge.node.creationTime).toLocaleString()}</Cell>
                <Cell>{edge.node.height}</Cell>
                <Cell>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.requestKey}`}>
                    <span title={edge.node.requestKey}>
                      {truncateColumns
                        ? truncate(edge.node.requestKey)
                        : edge.node.requestKey}
                    </span>
                  </Link>
                </Cell>
                <Cell>
                  {edge.node.code ? (
                    <span title={edge.node.code}>
                      {JSON.parse(
                        truncateColumns
                          ? truncate(edge.node.code)!
                          : edge.node.code,
                      )}
                    </span>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
