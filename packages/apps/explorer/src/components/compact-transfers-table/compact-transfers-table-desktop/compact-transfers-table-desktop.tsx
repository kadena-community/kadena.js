import type {
  ExecutionPayload,
  Transaction,
  TransactionResult,
  Transfer,
} from '@/__generated__/sdk';
import { tableClass } from '@/components/compact-keys-table/compact-keys-table-desktop/styles.css';
import {
  MonoArrowOutward,
  MonoCheck,
  MonoClear,
} from '@kadena/react-icons/system';
import {
  Badge,
  Cell,
  Column,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
  Text,
  maskValue,
} from '@kadena/react-ui';
import Link from 'next/link';
import React from 'react';
import {
  badgeClass,
  dataFieldClass,
  iconLinkClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from './styles.css';

interface ICompactTransferTableDesktopProps {
  transfers: Transfer[];
}

const CompactTransferTableDesktop: React.FC<
  ICompactTransferTableDesktopProps
> = ({ transfers }) => {
  console.log(transfers[0].transaction?.result, { transfers });
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
        {transfers.map((transfer) => (
          <Row key={transfer.requestKey}>
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
