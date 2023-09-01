import { type IHeader, TaggedHeading } from './Heading';

import React, { type FC } from 'react';

export const Heading3: FC<IHeader> = ({ children, ...rest }) => {
  return (
    <TaggedHeading as="h3" {...rest}>
      {children}
    </TaggedHeading>
  );
};
