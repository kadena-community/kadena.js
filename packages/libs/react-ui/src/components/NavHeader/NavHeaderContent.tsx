import type { FC } from 'react';
import React from 'react';
import { childrenClass } from './NavHeader.css';

export interface INavHeaderContentProps {
  children: React.ReactNode;
}

export const NavHeaderContent: FC<INavHeaderContentProps> = ({ children }) => {
  return <div className={childrenClass}>{children}</div>;
};
