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
  rowClass,
  sectionClass,
} from './styles.css';

interface ICompactTransactionsTableMobileProps {
  transactions: Transaction[];
}

const CompactTransactionsTableMobile: React.FC<
  ICompactTransactionsTableMobileProps
> = ({ transactions }) => {
  return (
    <>
      {transactions.map((transaction, index) => (
        <section key={index} className={sectionClass}>
          <div className={rowClass}>
            <span>
              <Badge className={badgeClass} size="sm">
                Status
              </Badge>
            </span>
            {(transaction.result as TransactionResult).goodResult ? (
              <MonoCheck />
            ) : (
              <MonoClear />
            )}
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Sender</span>
            <Text variant="code" className={dataFieldClass}>
              {transaction.cmd.meta.sender}
            </Text>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Request Key</span>
            <span className={dataFieldLinkClass}>
              <a
                href={`/transaction/${transaction.hash}`}
                className={linkClass}
              >
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
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Code</span>
            <Text variant="code" className={dataFieldClass}>
              {(transaction.cmd.payload as ExecutionPayload).code}
            </Text>
          </div>
        </section>
      ))}
    </>
  );
};
export default CompactTransactionsTableMobile;
