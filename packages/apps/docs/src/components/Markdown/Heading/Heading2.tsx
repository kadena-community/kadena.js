import type { IHeader } from './Heading';
import { TaggedHeading } from './Heading';

import type { FC } from 'react';
import React from 'react';

export const Heading2: FC<IHeader> = ({ children, ...rest }) => {
  return (
    <TaggedHeading as="h2" {...rest}>
      {children}
    </TaggedHeading>
  );
};
