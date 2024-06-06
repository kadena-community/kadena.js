import type { Transfer } from '@/__generated__/sdk';
import { tableClass } from '@/components/compact-keys-table/compact-keys-table-desktop/styles.css';

import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  maskValue,
} from '@kadena/react-ui';
import React from 'react';

interface ICompactTransferTableDesktopProps {
  transfers: Transfer[];
}

const CompactTransferTableDesktop: React.FC<
  ICompactTransferTableDesktopProps
> = ({ transfers }) => {
  return (
    <Table aria-label="Keys table" isStriped className={tableClass}>
      <TableHeader>
        <Column width="10%">Height</Column>
        <Column width="10%">ChainId</Column>
        <Column width="20%">Amount</Column>
        <Column width="20%">Sender</Column>
        <Column width="20%">Receiver</Column>
        <Column width="20%">RequestKey</Column>
      </TableHeader>
      <TableBody>
        {transfers.map((transfer, idx) => (
          <Row key={transfer.requestKey + idx}>
            <Cell>{transfer.height}</Cell>
            <Cell>{transfer.chainId}</Cell>
            <Cell>{transfer.amount} KDA</Cell>
            <Cell>
              <span>{maskValue(transfer.senderAccount)}</span>
            </Cell>
            <Cell>
              <span>{maskValue(transfer.receiverAccount)}</span>
            </Cell>
            <Cell>
              <span>{transfer.requestKey}</span>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
export default CompactTransferTableDesktop;
