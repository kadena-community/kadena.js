import type {
  BlockTransactionsConnection,
  FungibleAccountTransactionsConnection,
  FungibleChainAccountTransactionsConnection,
  NonFungibleAccountTransactionsConnection,
  NonFungibleChainAccountTransactionsConnection,
  QueryTransactionsConnection,
} from '@/__generated__/sdk';
import routes from '@constants/routes';
import { KSquareKdacolorGreen } from '@kadena/kode-icons/brand';
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
  Tooltip,
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import { truncate } from '@utils/truncate';
import React from 'react';

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
        icon={<KSquareKdacolorGreen />}
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
      <Table className={atoms({ wordBreak: 'break-all' })} isCompact>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Timestamp</Column>
          <Column>Block Height</Column>
          <Column>Request Key</Column>
          <Column>Code</Column>
        </TableHeader>
        <TableBody>
          {transactions.edges.slice(0, 10).map((edge, index) => {
            return (
              <Row key={index}>
                <Cell>{edge?.node.hash}</Cell>
                <Cell>
                  {new Date(edge.node.cmd.meta.creationTime).toLocaleString()}
                </Cell>
                <Cell>
                  {edge.node.result.__typename === 'TransactionResult' ? (
                    edge.node.result.height
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Cell>
                <Cell>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.hash}`}>
                    {truncateColumns ? (
                      <Tooltip
                        closeDelay={150}
                        content={edge.node.hash}
                        delay={500}
                        position="left"
                      >
                        <span>{truncate(edge.node.hash)}</span>
                      </Tooltip>
                    ) : (
                      <span>{edge.node.hash}</span>
                    )}
                  </Link>
                </Cell>
                <Cell>
                  {edge.node.cmd.payload.__typename === 'ExecutionPayload' &&
                  edge.node.cmd.payload.code ? (
                    truncateColumns ? (
                      <Tooltip
                        closeDelay={150}
                        content={edge.node.cmd.payload.code}
                        delay={500}
                        position="left"
                      >
                        <span>
                          {truncate(JSON.parse(edge.node.cmd.payload.code))}
                        </span>
                      </Tooltip>
                    ) : (
                      <span>{JSON.parse(edge.node.cmd.payload.code)}</span>
                    )
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
