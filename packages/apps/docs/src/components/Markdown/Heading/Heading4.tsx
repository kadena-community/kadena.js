import type { FC } from 'react';
import React from 'react';
import type { IHeader } from './Heading';
import { TaggedHeading } from './Heading';

export const Heading4: FC<IHeader> = ({ children }) => {
  return <TaggedHeading as="h4">{children}</TaggedHeading>;
};
