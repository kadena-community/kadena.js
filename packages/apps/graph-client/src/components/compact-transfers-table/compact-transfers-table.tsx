import type {
  ChainModuleAccountTransfersConnection,
  ModuleAccountTransfersConnection,
} from '@/__generated__/sdk';
import routes from '@constants/routes';
import { Box, Button, ContentHeader, Link, Table } from '@kadena/react-ui';
import { truncate } from '@utils/truncate';
import React from 'react';

interface ICompactTransfersTableProps {
  moduleName: string;
  accountName: string;
  chainId?: string;
  truncateColumns?: boolean;
  transfers:
    | ModuleAccountTransfersConnection
    | ChainModuleAccountTransfersConnection;

  description?: string;
}

export const CompactTransfersTable = (
  props: ICompactTransfersTableProps,
): JSX.Element => {
  const {
    moduleName,
    accountName,
    chainId,
    truncateColumns,
    transfers,
    description,
  } = props;

  return (
    <>
      <ContentHeader
        heading="Transfers"
        icon="KIcon"
        description={
          description ? description : 'All transfers from this fungible'
        }
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
          {transfers.edges.slice(0, 10).map((edge, index) => {
            /**  These transfers are going to be added to their crosschain counterpart and
             this way we avoid repeated transfers in the table */
            if (!chainId && edge?.node.transaction?.pactId) {
              return <></>;
            }

            const chainIdDisplay = edge?.node.crossChainTransfer
              ? `${edge.node.chainId} / ${edge.node.crossChainTransfer.chainId}`
              : edge?.node.chainId;

            const heightDisplay = edge?.node.crossChainTransfer
              ? `${edge.node.height} / ${edge.node.crossChainTransfer.height}`
              : edge?.node.height;

            return (
              <Table.Tr key={index}>
                <Table.Td>{chainIdDisplay}</Table.Td>
                <Table.Td>{heightDisplay}</Table.Td>
                <Table.Td>{edge?.node.amount}</Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.senderAccount}`}
                  >
                    <span title={edge?.node.senderAccount}>
                      {truncateColumns
                        ? truncate(edge?.node.senderAccount)
                        : edge?.node.senderAccount}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  {!edge?.node.crossChainTransfer ? (
                    <Link
                      href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.receiverAccount}`}
                    >
                      <span title={edge?.node.receiverAccount}>
                        {truncateColumns
                          ? truncate(edge?.node.receiverAccount)
                          : edge?.node.receiverAccount}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href={`${routes.ACCOUNT}/${moduleName}/${edge?.node.crossChainTransfer.receiverAccount}`}
                    >
                      <span
                        title={edge?.node.crossChainTransfer.receiverAccount}
                      >
                        {truncateColumns
                          ? truncate(
                              edge?.node.crossChainTransfer.receiverAccount,
                            )
                          : edge?.node.crossChainTransfer.receiverAccount}
                      </span>
                    </Link>
                  )}
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.TRANSACTIONS}/${edge?.node.requestKey}`}
                  >
                    <span title={edge?.node.requestKey}>
                      {truncateColumns
                        ? truncate(edge?.node.requestKey)
                        : edge?.node.requestKey}
                    </span>
                  </Link>
                  {edge?.node.crossChainTransfer && (
                    <>
                      &nbsp;/&nbsp;
                      <Link
                        href={`${routes.TRANSACTIONS}/${edge?.node.crossChainTransfer.requestKey}`}
                      >
                        <span title={edge?.node.crossChainTransfer.requestKey}>
                          {truncateColumns
                            ? truncate(edge?.node.crossChainTransfer.requestKey)
                            : edge?.node.crossChainTransfer.requestKey}
                        </span>
                      </Link>
                    </>
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
