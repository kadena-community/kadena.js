import type { ITableProps } from '@kadena/react-ui';
import { Table as StyledTable } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { wrapperClass } from '../styles.css';

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <div className={wrapperClass}>
      <StyledTable.Root striped>{children}</StyledTable.Root>
    </div>
  );
};
