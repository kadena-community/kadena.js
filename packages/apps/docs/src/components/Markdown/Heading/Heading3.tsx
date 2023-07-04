import { IHeader, TaggedHeading } from './Heading';

import React, { FC } from 'react';

export const Heading3: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h3">{children}</TaggedHeading>;
};
