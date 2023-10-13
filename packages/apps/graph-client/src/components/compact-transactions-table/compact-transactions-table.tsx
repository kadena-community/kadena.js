import { Box, Button, ContentHeader, Link, Table } from '@kadena/react-ui';

import type {
  GetAccountQuery,
  GetBlockFromHashQuery,
  GetChainAccountQuery,
} from '../../__generated__/sdk';
import routes from '../../constants/routes';
import { truncate } from '../../utils/truncate';

import React from 'react';

interface ICompactTransactionsTableProps {
  // moduleName: string;
  // accountName: string;
  // chainId?: string;
  viewAllHref?: string;
  description?: string;
  transactions:
    | GetAccountQuery['account']['transactions']
    | GetChainAccountQuery['chainAccount']['transactions']
    | GetBlockFromHashQuery['block']['transactions'];
}

export const CompactTransactionsTable = (
  props: ICompactTransactionsTableProps,
): JSX.Element => {
  const { viewAllHref, description, transactions } = props;

  // const { moduleName, accountName, chainId, viewAllHref, transactions } = props;

  return (
    <>
      <ContentHeader
        heading="Transactions"
        icon="KIcon"
        description={
          description
            ? description
            : 'All transactions where this account is the initiator.'
        }
      />
      <Box margin={'$4'} />
      <Button variant="compact" as="a" href={viewAllHref}>
        View all transactions
      </Button>
      <Box margin={'$2'} />
      <Table.Root wordBreak="break-word">
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
          {transactions.edges.map((edge, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td>{edge?.node.chainId}</Table.Td>
                <Table.Td>
                  {new Date(edge?.node.creationTime).toLocaleString()}
                </Table.Td>
                <Table.Td>{edge?.node.height}</Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}>
                    {truncate(edge?.node.requestKey)}
                  </Link>
                </Table.Td>
                <Table.Td>
                  {edge?.node.code ? (
                    <span title={edge?.node.code as string}>
                      {truncate(edge?.node.code)}
                    </span>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};
