import { wrapperClass } from '../styles.css';

import { BodyText } from '@/components/Typography';
import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const Paragraph: FC<IProp> = ({ children }) => {
  return (
    <div className={wrapperClass}>
      <BodyText as="p">{children}</BodyText>
    </div>
  );
};
