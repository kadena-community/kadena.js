import { type ITextProps, Text } from '@kadena/react-ui';

import React, { type FC, type ReactNode } from 'react';

export interface IBodyTextProps {
  children?: ReactNode;
  as?: ITextProps['as'];
  bold?: ITextProps['bold'];
}

export const BodyText: FC<IBodyTextProps> = ({ children, as, bold }) => {
  return (
    <Text as={as} bold={bold}>
      {children}
    </Text>
  );
};
