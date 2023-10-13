import type { ITableProps } from '@kadena/react-ui';
import { Table as StyledTable } from '@kadena/react-ui';

import { wrapperClass } from '../styles.css';

import { tableWrapperClass } from './styles.css';

import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <div className={classNames(wrapperClass, tableWrapperClass)}>
      <StyledTable.Root>{children}</StyledTable.Root>
    </div>
  );
};
