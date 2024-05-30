import type { ITableRowProps } from '@kadena/react-ui';
import { Row as UIRow } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const Row: FC<ITableRowProps<any>> = ({ children, ...rest }) => {
  return <UIRow {...rest}>{children}</UIRow>;
};
