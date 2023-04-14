import { Heading } from '@kadena/react-components';

import { IHeadingLevelProps } from './types';

import React, { FC } from 'react';

export const HeadingLevel3: FC<IHeadingLevelProps> = ({
  children,
  bold = true,
}) => {
  return (
    <Heading as="h3" variant="h3" bold={bold}>
      {children}
    </Heading>
  );
};
