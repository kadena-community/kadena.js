import { Text } from '@kadena/react-ui';

import { paragraphWrapperClass } from './styles.css';

import { BodyText } from '@/components/Typography';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProp {
  children: ReactNode;
}

export const Paragraph: FC<IProp> = ({ children }) => {
  return (
    <div className={paragraphWrapperClass}>
      <BodyText as="p">{children}</BodyText>
    </div>
  );
};
