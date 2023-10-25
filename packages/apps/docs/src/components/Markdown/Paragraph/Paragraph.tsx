import { BodyText } from '@/components/Typography/BodyText';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { paragraphWrapperClass } from './styles.css';

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
