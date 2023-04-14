import { Heading, IHeadingProps } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  bold?: IHeadingProps['bold'];
}

export const HeadingLevel2: FC<IProps> = ({ children, bold = true }) => {
  return (
    <Heading as="h2" variant="h2" bold={bold}>
      {children}
    </Heading>
  );
};
