import { ITextProps, Text } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  as?: ITextProps['as'];
  bold?: ITextProps['bold'];
}

export const BodyText: FC<IProps> = ({ children, as, bold }) => {
  return (
    <Text as={as} bold={bold}>
      {children}
    </Text>
  );
};
