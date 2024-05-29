import {
  ExecutionPayload,
  Transaction,
  TransactionResult,
} from '@/__generated__/sdk';
import {
  MonoArrowOutward,
  MonoCheck,
  MonoClear,
} from '@kadena/react-icons/system';
import { Badge, Text } from '@kadena/react-ui';
import React, { Fragment } from 'react';
import {
  badgeClass,
  dataFieldClass,
  dataFieldLinkClass,
  headerClass,
  iconLinkClass,
  linkClass,
  linkIconClass,
  sectionClass,
} from './styles.css';

interface ICompactTransactionsTableDesktopProps {
  transactions: Transaction[];
}

const CompactTransactionsTableDesktop: React.FC<
  ICompactTransactionsTableDesktopProps
> = ({ transactions }) => {
  return (
    <section className={sectionClass}>
      <span>
        <Badge className={badgeClass} size="sm">
          Status
        </Badge>
      </span>
      <span className={headerClass}>Sender</span>
      <span className={headerClass}>Request Key</span>
      <span className={headerClass}>Code Preview</span>
      {transactions.map((transaction, index) => (
        <Fragment key={index}>
          {(transaction.result as TransactionResult).goodResult ? (
            <MonoCheck />
          ) : (
            <MonoClear />
          )}
          <Text variant="code" className={dataFieldClass}>
            {transaction.cmd.meta.sender}
          </Text>
          <span className={dataFieldLinkClass}>
            <a href={`/transaction/${transaction.hash}`} className={linkClass}>
              <Text variant="code" className={dataFieldClass}>
                {transaction.hash}
              </Text>
            </a>
            <a
              href={`/transaction/${transaction.hash}`}
              className={iconLinkClass}
            >
              <MonoArrowOutward className={linkIconClass} />
            </a>
          </span>
          <Text variant="code" className={dataFieldClass}>
            {(transaction.cmd.payload as ExecutionPayload).code}
          </Text>
        </Fragment>
      ))}
    </section>
  );
};
export default CompactTransactionsTableDesktop;
