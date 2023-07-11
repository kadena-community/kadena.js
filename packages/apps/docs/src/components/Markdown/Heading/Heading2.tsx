import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading2: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h2">{children}</TaggedHeading>;
};
