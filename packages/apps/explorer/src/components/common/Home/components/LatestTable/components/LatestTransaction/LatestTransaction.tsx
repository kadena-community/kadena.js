import React, { FC, memo } from 'react';
import style from './LatestTransaction.module.css';
import TableContainer, { ITableProps } from '../TableContainer/TableContainer';

const LatestTransaction: FC<ITableProps> = ({
  data: dataTableTransactions,
  onTablePopover,
  activeTab,
}) => {
  return (
    <div className={style.transactionContainer}>
      <TableContainer
        data={dataTableTransactions}
        onTablePopover={onTablePopover}
        activeTab={activeTab}
        mode="transaction"
      />
    </div>
  );
};

export default memo(LatestTransaction);
