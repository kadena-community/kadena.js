import type {
  ExecutionPayload,
  Transaction,
  TransactionResult,
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

interface ICompactTransactionsTableDesktopProps {
  transactions: Transaction[];
}

const CompactTransactionsTableDesktop: React.FC<
  ICompactTransactionsTableDesktopProps
> = ({ transactions }) => {
  return (
    <Table aria-label="Keys table" isStriped className={tableClass}>
      <TableHeader>
        <Column width="10%">
          <Badge className={badgeClass} size="sm">
            Status
          </Badge>
        </Column>
        <Column width="25%">Sender</Column>
        <Column width="25%">Request Key</Column>
        <Column width="40%">Code Preview</Column>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <Row key={transaction.id}>
            <Cell>
              {(transaction.result as TransactionResult).goodResult ? (
                <MonoCheck />
              ) : (
                <MonoClear />
              )}
            </Cell>
            <Cell>
              <Text as="span" variant="code" className={dataFieldClass}>
                {transaction.cmd.meta.sender}
              </Text>
            </Cell>
            <Cell>
              <span>
                <Stack alignItems="center" className={linkWrapperClass}>
                  <Link
                    href={`/transaction/${transaction.hash}`}
                    className={linkClass}
                  >
                    <Text variant="code" className={dataFieldClass}>
                      {transaction.hash}
                    </Text>
                  </Link>
                  <Link
                    href={`/transaction/${transaction.hash}`}
                    className={iconLinkClass}
                  >
                    <MonoArrowOutward className={linkIconClass} />
                  </Link>
                </Stack>
              </span>
            </Cell>
            <Cell>
              <Text as="span" variant="code" className={dataFieldClass}>
                {(transaction.cmd.payload as ExecutionPayload).code}
              </Text>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
export default CompactTransactionsTableDesktop;
