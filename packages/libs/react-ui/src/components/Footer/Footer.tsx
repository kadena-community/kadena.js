import { containerClass } from './Footer.css';

import React, { FC } from 'react';

export interface IFooterProps {
  children: React.ReactNode;
}

export const FooterContainer: FC<IFooterProps> = ({ children }) => {
  return (
    <footer className={containerClass} data-testid="kda-footer">
      {children}
    </footer>
  );
};
