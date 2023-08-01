import { containerClass } from './NavHeader.css';

import React, { FC } from 'react';

export interface INavHeaderContainerProps {
  children: React.ReactNode;
}

export const NavHeaderContainer: FC<INavHeaderContainerProps> = ({
  children,
}) => {
  return (
    <header className={containerClass} data-testid="kda-navheader">
      {children}
    </header>
  );
};
