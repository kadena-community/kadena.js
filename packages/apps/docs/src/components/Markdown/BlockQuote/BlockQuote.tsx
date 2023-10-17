import { blockquote } from './style.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProp {
  children: ReactNode;
}

export const BlockQuote: FC<IProp> = ({ children }) => {
  return <blockquote className={blockquote}>{children}</blockquote>;
};
