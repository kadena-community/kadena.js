import { ITableProps, Table as StyledTable } from '@kadena/react-ui';

import { wrapper } from './styles.css';

import React, { FC } from 'react';

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <div className={wrapper}>
      <StyledTable.Root>{children}</StyledTable.Root>
    </div>
  );
};
