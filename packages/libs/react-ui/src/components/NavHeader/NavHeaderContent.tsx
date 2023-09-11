import { childrenClass } from './NavHeader.css';

import type { INavHeaderSelectProps } from '@components/NavHeader/NavHeaderSelect';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';

export interface INavHeaderContentProps {
  children: React.ReactNode | FunctionComponentElement<INavHeaderSelectProps>[];
}

export const NavHeaderContent: FC<INavHeaderContentProps> = ({ children }) => {
  return <div className={childrenClass}>{children}</div>;
};
