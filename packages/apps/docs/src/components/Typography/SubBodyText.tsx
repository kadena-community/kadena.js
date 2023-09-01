import { type ITextProps, Text } from '@kadena/react-ui';

import React, { type FC, type ReactNode } from 'react';

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
