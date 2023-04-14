import { Heading, IHeadingProps } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  bold?: IHeadingProps['bold'];
}

export const HeadingLevel4: FC<IProps> = ({ children, bold = true }) => {
  return (
    <Heading as="h4" variant="h4" bold={bold}>
      {children}
    </Heading>
  );
};
