import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading1: FC<IHeader> = ({ children, ...rest }) => {
  return (
    <TaggedHeading as="h1" {...rest}>
      {children}
    </TaggedHeading>
  );
};
