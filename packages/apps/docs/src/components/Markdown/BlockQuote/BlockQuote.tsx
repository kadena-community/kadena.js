import type { FC, ReactNode } from 'react';
import React from 'react';
import { blockquote } from './style.css';

interface IProp {
  children: ReactNode;
}

export const BlockQuote: FC<IProp> = ({ children }) => {
  return <blockquote className={blockquote}>{children}</blockquote>;
};
