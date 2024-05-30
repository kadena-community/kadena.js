import type { ITableBodyProps } from '@kadena/react-ui';
import { TableBody as UITableBody } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const TableBody: FC<ITableBodyProps<any>> = ({ children, ...rest }) => {
  return (
    <UITableBody type="tbody" {...rest}>
      {children}
    </UITableBody>
  );
};
