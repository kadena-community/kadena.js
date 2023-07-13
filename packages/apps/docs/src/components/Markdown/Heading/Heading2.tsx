import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading2: FC<IHeader> = ({ children, ...rest }) => {
  return (
    <TaggedHeading as="h2" {...rest}>
      {children}
    </TaggedHeading>
  );
};
