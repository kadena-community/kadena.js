import type { ITableColumnProps } from '@kadena/react-ui';
import { Column as UIColumn } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const Column: FC<ITableColumnProps<any>> = ({ children, ...rest }) => {
  return (
    <UIColumn type="column" {...rest}>
      {children}
    </UIColumn>
  );
};
