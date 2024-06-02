import type { ITableHeaderProps } from '@kadena/react-ui';
import { TableHeader as UITableHeader } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const TableHeader: FC<ITableHeaderProps<any>> = ({
  children,
  ...rest
}) => {
  return (
    <UITableHeader type="thead" {...rest}>
      {children}
    </UITableHeader>
  );
};
