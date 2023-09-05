import type { ITextProps } from '@kadena/react-ui';
import { Text } from '@kadena/react-ui';

import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IProps {
  children?: ReactNode;
  as?: ITextProps['as'];
  bold?: ITextProps['bold'];
}

export const SubBodyText: FC<IProps> = ({ children, as, bold }) => {
  return (
    <Text as={as} bold={bold} size="md">
      {children}
    </Text>
  );
};
