import { blockquote } from './style.css';

import React, { type FC, type ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const BlockQuote: FC<IProp> = ({ children, ...props }) => {
  return <blockquote className={blockquote}>{children}</blockquote>;
};
