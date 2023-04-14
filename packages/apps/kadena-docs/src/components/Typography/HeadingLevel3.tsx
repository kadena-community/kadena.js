import { Heading, IHeadingProps } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  bold?: IHeadingProps['bold'];
}

export const HeadingLevel3: FC<IProps> = ({ children, bold = true }) => {
  return (
    <Heading as="h3" variant="h3" bold={bold}>
      {children}
    </Heading>
  );
};
