import type { ITableCellProps } from '@kadena/react-ui';
import { Cell as UICell } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const Cell: FC<ITableCellProps> = ({ children, ...rest }) => {
  return <UICell {...rest}>{children}</UICell>;
};
