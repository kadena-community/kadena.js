import React, { FC, memo } from 'react';
import style from './LatestBlocks.module.css';
import TableContainer, { ITableProps } from '../TableContainer/TableContainer';

const LatestBlocks: FC<ITableProps> = ({
  data: dataTableBlocks,
  onTablePopover,
}) => {
  return (
    <div className={style.blockContainer}>
      <TableContainer
        data={dataTableBlocks}
        onTablePopover={onTablePopover}
        mode="block"
      />
    </div>
  );
};

export default memo(LatestBlocks);
