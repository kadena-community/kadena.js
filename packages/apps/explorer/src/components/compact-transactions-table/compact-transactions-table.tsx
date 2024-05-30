import type { Transaction } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import React from 'react';
import CompactTransactionsTableDesktop from './compact-transactions-table-desktop/compact-transactions-table-desktop';
import CompactTransactionsTableMobile from './compact-transactions-table-mobile/compact-transactions-table-mobile';

interface ICompactTransactionsTableProps {
  transactions: Transaction[];
}

const CompactTransactionsTable: React.FC<ICompactTransactionsTableProps> = ({
  transactions,
}) => {
  return (
    <>
      <Media lessThan="sm">
        <CompactTransactionsTableMobile transactions={transactions} />
      </Media>
      <Media greaterThanOrEqual="sm">
        <CompactTransactionsTableDesktop transactions={transactions} />
      </Media>
    </>
  );
};
export default CompactTransactionsTable;
