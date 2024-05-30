import type { ITableProps } from '@kadena/react-ui';
import { Table as UITable } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { wrapperClass } from '../styles.css';

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <div className={wrapperClass}>
      <UITable type="table" isStriped>
        {children}
      </UITable>
    </div>
  );
};
