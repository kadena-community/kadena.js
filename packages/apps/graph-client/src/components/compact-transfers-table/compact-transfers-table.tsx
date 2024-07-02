import type {
  FungibleAccountTransfersConnection,
  FungibleChainAccountTransfersConnection,
  Transfer,
} from '@/__generated__/sdk';
import routes from '@constants/routes';
import { KSquareKdacolorGreen } from '@kadena/react-icons/brand';
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
interface ICompactTransfersTableProps {
  fungibleName: string;
  accountName: string;
  chainId?: string;
  truncateColumns?: boolean;
  transfers:
    | FungibleAccountTransfersConnection
    | FungibleChainAccountTransfersConnection;

  description?: string;
}

interface XChainTransfer {
  startingTransfer: Transfer;
  finishingTransfer: Transfer;
}

export const CompactTransfersTable = (
  props: ICompactTransfersTableProps,
): JSX.Element => {
  const {
    fungibleName,
    accountName,
    chainId,
    truncateColumns,
    transfers,
    description,
  } = props;

  // This function determines if the transfer is the starting one or the finishing one
  const determineXChainTransferOrder = (
    transfer: Transfer,
    crossChainTransfer: Transfer,
  ): XChainTransfer => {
    if (
      transfer.transaction?.cmd.payload.__typename === 'ContinuationPayload'
    ) {
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
        icon={<KSquareKdacolorGreen />}
        description={
          description ? description : 'All transfers from this fungible'
        }
      />
      <Box margin="sm" />
      <Link
        isCompact
        href={`${routes.ACCOUNT_TRANSFERS}/${fungibleName}/${accountName}${
          chainId !== undefined ? `?chain=${chainId}` : ''
        }`}
      >
        View all transfers
      </Link>
      <Box margin="xs" />
      <Table className={atoms({ wordBreak: 'break-all' })} isCompact>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Timestamp</Column>
          <Column>Block Height</Column>
          <Column>Amount</Column>
          <Column>Sender Account</Column>
          <Column>Receiver Account</Column>
          <Column>Request key</Column>
        </TableHeader>
        <TableBody>
          {transfers.edges.map((edge, index) => {
            let transfer = edge.node;
            let crossChainCounterPart = edge.node.crossChainTransfer;

            if (!chainId) {
              /**  These transfers are going to be added to their crosschain counterpart and
             this way we avoid repeated transfers in the table */
              if (
                transfer.transaction?.cmd.payload.__typename ===
                'ContinuationPayload'
              )
                return <></>;
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
              <Row key={index}>
                <Cell>{chainIdDisplay}</Cell>
                <Cell> {new Date(transfer.creationTime).toLocaleString()}</Cell>
                <Cell>{heightDisplay}</Cell>
                <Cell>{transfer.amount}</Cell>
                <Cell>
                  <Link
                    href={`${routes.ACCOUNT}/${fungibleName}/${transfer.senderAccount}`}
                  >
                    {truncateColumns ? (
                      <Tooltip
                        closeDelay={150}
                        content={transfer.senderAccount}
                        delay={500}
                        position="left"
                      >
                        <span>{truncate(transfer.senderAccount)}</span>
                      </Tooltip>
                    ) : (
                      <span>{transfer.senderAccount}</span>
                    )}
                  </Link>
                </Cell>
                <Cell>
                  {!crossChainCounterPart ? (
                    <Link
                      href={`${routes.ACCOUNT}/${fungibleName}/${transfer.receiverAccount}`}
                    >
                      {truncateColumns ? (
                        <Tooltip
                          closeDelay={150}
                          content={transfer.receiverAccount}
                          delay={500}
                          position="left"
                        >
                          <span>{truncate(transfer.receiverAccount)}</span>
                        </Tooltip>
                      ) : (
                        <span>{transfer.receiverAccount}</span>
                      )}
                    </Link>
                  ) : (
                    <Link
                      href={`${routes.ACCOUNT}/${fungibleName}/${crossChainCounterPart.receiverAccount}`}
                    >
                      {truncateColumns ? (
                        <Tooltip
                          closeDelay={150}
                          content={crossChainCounterPart.receiverAccount}
                          delay={500}
                          position="left"
                        >
                          <span>
                            {truncate(crossChainCounterPart.receiverAccount)}
                          </span>
                        </Tooltip>
                      ) : (
                        <span>{crossChainCounterPart.receiverAccount}</span>
                      )}
                    </Link>
                  )}
                </Cell>
                <Cell>
                  <Link href={`${routes.TRANSACTIONS}/${transfer.requestKey}`}>
                    {truncateColumns ? (
                      <Tooltip
                        closeDelay={150}
                        content={transfer.requestKey}
                        delay={500}
                        position="left"
                      >
                        <span>{truncate(transfer.requestKey)}</span>
                      </Tooltip>
                    ) : (
                      <span>{transfer.requestKey}</span>
                    )}
                  </Link>
                  {crossChainCounterPart && (
                    <>
                      <span> / </span>
                      <Link
                        href={`${routes.TRANSACTIONS}/${crossChainCounterPart.requestKey}`}
                      >
                        {truncateColumns ? (
                          <Tooltip
                            closeDelay={150}
                            content={crossChainCounterPart.requestKey}
                            delay={500}
                            position="left"
                          >
                            <span>
                              {truncate(crossChainCounterPart.requestKey)}
                            </span>
                          </Tooltip>
                        ) : (
                          <span>{crossChainCounterPart.requestKey}</span>
                        )}
                      </Link>
                    </>
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
