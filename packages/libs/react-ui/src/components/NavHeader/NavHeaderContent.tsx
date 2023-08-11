import { childrenClass } from './NavHeader.css';

import React, { FC } from 'react';

export interface INavHeaderContentProps {
  children: React.ReactNode;
}

export const NavHeaderContent: FC<INavHeaderContentProps> = ({ children }) => {
  return <div className={childrenClass}>{children}</div>;
};
