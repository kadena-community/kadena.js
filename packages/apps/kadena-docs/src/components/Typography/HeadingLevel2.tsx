import { Heading } from '@kadena/react-components';

import { IHeadingLevelProps } from './types';

import React, { FC } from 'react';

export const HeadingLevel2: FC<IHeadingLevelProps> = ({
  children,
  bold = true,
}) => {
  return (
    <Heading as="h2" variant="h2" bold={bold}>
      {children}
    </Heading>
  );
};
