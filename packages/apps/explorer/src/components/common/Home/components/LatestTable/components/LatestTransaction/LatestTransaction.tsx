import TableContainer, { ITableProps } from '../TableContainer/TableContainer';

import style from './LatestTransaction.module.css';

import React, { FC, memo } from 'react';

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
