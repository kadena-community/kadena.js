import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading3: FC<IHeader> = ({ children, ...rest }) => {
  return (
    <TaggedHeading as="h3" {...rest}>
      {children}
    </TaggedHeading>
  );
};
