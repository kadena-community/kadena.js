import { BodyText } from '@/components/Typography';
import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const Paragraph: FC<IProp> = ({ children }) => {
  return <BodyText as="p">{children}</BodyText>;
};
