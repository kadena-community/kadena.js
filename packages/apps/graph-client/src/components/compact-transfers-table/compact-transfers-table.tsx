import type {
  GetAccountQuery,
  GetChainAccountQuery,
} from '@/__generated__/sdk';
import routes from '@constants/routes';
import { Box, Button, ContentHeader, Link, Table } from '@kadena/react-ui';
import { truncate } from '@utils/truncate';
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
      <Button
        variant="compact"
        as="a"
        href={`${routes.ACCOUNT_TRANSFERS}/${moduleName}/${accountName}${
          chainId !== undefined ? `?chain=${chainId}` : ''
        }`}
      >
        View all transfers
      </Button>
      <Box margin={'$2'} />
      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Sender Account</Table.Th>
            <Table.Th>Receiver Account</Table.Th>
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
                    href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.senderAccount}`}
                  >
                    <span title={edge?.node.senderAccount}>
                      {truncate(edge?.node.senderAccount)}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.receiverAccount}`}
                  >
                    <span title={edge?.node.receiverAccount}>
                      {truncate(edge?.node.receiverAccount)}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTION}/${edge?.node.requestKey}`}>
                    <span title={edge?.node.requestKey}>
                      {truncate(edge?.node.requestKey)}
                    </span>
                  </Link>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};
