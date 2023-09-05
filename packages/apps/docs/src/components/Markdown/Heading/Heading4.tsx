import type { IHeader } from './Heading';
import { TaggedHeading } from './Heading';

import type { FC } from 'react';
import React from 'react';

export const Heading4: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h4">{children}</TaggedHeading>;
};
