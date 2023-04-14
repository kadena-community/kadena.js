import { Heading, IHeadingProps } from '@kadena/react-components';

import { IHeadingLevelProps } from './types';

import React, { FC, ReactNode } from 'react';

export const HeadingLevel1: FC<IHeadingLevelProps> = ({
  children,
  bold = true,
}) => {
  return (
    <Heading as="h1" variant="h1" bold={bold}>
      {children}
    </Heading>
  );
};
