import TableContainer, { ITableProps } from '../TableContainer/TableContainer';

import style from './LatestBlocks.module.css';

import React, { FC, memo } from 'react';

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
