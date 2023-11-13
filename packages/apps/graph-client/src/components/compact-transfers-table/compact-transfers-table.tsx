import type {
  ChainModuleAccountTransfersConnection,
  ModuleAccountTransfersConnection,
  Transfer,
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
    | ModuleAccountTransfersConnection
    | ChainModuleAccountTransfersConnection;

  description?: string;
}

interface XChainTransfer {
  startingTransfer: Transfer;
  finishingTransfer: Transfer;
}

export const CompactTransfersTable = (
  props: ICompactTransfersTableProps,
): JSX.Element => {
  const { moduleName, accountName, chainId, transfers, description } = props;

  // This function determines if the transfer is the starting one or the finishing one
  const determineXChainTransferOrder = (
    transfer: Transfer,
    crossChainTransfer: Transfer,
  ): XChainTransfer => {
    if (transfer.transaction?.pactId) {
      // This means that the transfer on this chain is the finishing one
      return {
        startingTransfer: crossChainTransfer,
        finishingTransfer: transfer,
      };
    } else {
      return {
        startingTransfer: transfer,
        finishingTransfer: crossChainTransfer,
      };
    }
  };

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
          {transfers.edges.map((edge, index) => {
            let transfer = edge.node;
            let crossChainCounterPart = edge.node.crossChainTransfer;

            if (!chainId) {
              /**  These transfers are going to be added to their crosschain counterpart and
             this way we avoid repeated transfers in the table */
              if (transfer.transaction?.pactId) return <></>;
            } else {
              if (crossChainCounterPart) {
                const { startingTransfer, finishingTransfer } =
                  determineXChainTransferOrder(transfer, crossChainCounterPart);
                transfer = startingTransfer;
                crossChainCounterPart = finishingTransfer;
              }
            }

            const chainIdDisplay = crossChainCounterPart
              ? `${transfer.chainId} / ${crossChainCounterPart.chainId}`
              : transfer.chainId;

            const heightDisplay = crossChainCounterPart
              ? `${transfer.height} / ${crossChainCounterPart.height}`
              : transfer.height;

            return (
              <Table.Tr key={index}>
                <Table.Td>{chainIdDisplay}</Table.Td>
                <Table.Td>{heightDisplay}</Table.Td>
                <Table.Td>{transfer.amount}</Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${moduleName}/${transfer.senderAccount}`}
                  >
                    <span title={transfer.senderAccount}>
                      {truncate(transfer.senderAccount)}
                    </span>
                  </Link>
                </Table.Td>
                <Table.Td>
                  {!crossChainCounterPart ? (
                    <Link
                      href={`${routes.ACCOUNT}/${moduleName}/${transfer.receiverAccount}`}
                    >
                      <span title={transfer.receiverAccount}>
                        {truncate(transfer.receiverAccount)}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href={`${routes.ACCOUNT}/${moduleName}/${crossChainCounterPart.receiverAccount}`}
                    >
                      <span title={crossChainCounterPart.receiverAccount}>
                        {truncate(crossChainCounterPart.receiverAccount)}
                      </span>
                    </Link>
                  )}
                </Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTIONS}/${transfer.requestKey}`}>
                    <span title={transfer.requestKey}>
                      {truncate(transfer.requestKey)}
                    </span>
                  </Link>
                  /
                  {crossChainCounterPart && (
                    <Link
                      href={`${routes.TRANSACTIONS}/${crossChainCounterPart.requestKey}`}
                    >
                      <span title={crossChainCounterPart.requestKey}>
                        {truncate(crossChainCounterPart.requestKey)}
                      </span>
                    </Link>
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
