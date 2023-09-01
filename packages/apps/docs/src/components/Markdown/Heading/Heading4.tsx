import { type IHeader, TaggedHeading } from './Heading';

import React, { type FC } from 'react';

export const Heading4: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h4">{children}</TaggedHeading>;
};
