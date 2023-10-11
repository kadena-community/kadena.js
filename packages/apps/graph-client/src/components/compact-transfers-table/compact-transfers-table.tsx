import { Box, Button, ContentHeader, Link, Table } from '@kadena/react-ui';

import type {
  GetAccountQuery,
  GetChainAccountQuery,
} from '../../__generated__/sdk';
import routes from '../../constants/routes';
import { truncate } from '../../utils/truncate';

import React from 'react';

interface ICompactTransfersTableProps {
  moduleName: string;
  accountName: string;
  chainId?: string;
  transfers:
    | GetAccountQuery['account']['transfers']
    | GetChainAccountQuery['chainAccount']['transfers'];
}

export const CompactTransfersTable = (
  props: ICompactTransfersTableProps,
): JSX.Element => {
  const { moduleName, accountName, chainId, transfers } = props;

  return (
    <>
      <ContentHeader
        heading="Transfers"
        icon="KIcon"
        description="All transfers from this fungible."
      />
      <Box margin={'$4'} />
      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>From Account</Table.Th>
            <Table.Th>To Account</Table.Th>
            <Table.Th>Request key</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {transfers.edges.map((edge, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td>{edge?.node.chainId}</Table.Td>
                <Table.Td>{edge?.node.height}</Table.Td>
                <Table.Td>{edge?.node.amount}</Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.fromAccount}`}
                  >
                    <span title={edge?.node.fromAccount}>
                      {truncate(edge?.node.fromAccount)}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.toAccount}`}
                  >
                    <span title={edge?.node.toAccount}>
                      {truncate(edge?.node.toAccount)}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}>
                    {truncate(edge?.node.requestKey)}
                  </Link>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
      <Button
        variant="compact"
        href={`${routes.ACCOUNT_TRANSFERS}/${moduleName}/${accountName}${
          chainId !== undefined ? `?chainId=${chainId}` : ''
        }`}
      >
        View all transfers
      </Button>
    </>
  );
};
