import { Heading } from '@kadena/react-components';

import { IHeadingLevelProps } from './';

import React, { FC } from 'react';

export const HeadingLevel4: FC<IHeadingLevelProps> = ({
  children,
  bold = true,
}) => {
  return (
    <Heading as="h4" variant="h4" bold={bold}>
      {children}
    </Heading>
  );
};
