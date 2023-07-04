import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading1: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h1">{children}</TaggedHeading>;
};
