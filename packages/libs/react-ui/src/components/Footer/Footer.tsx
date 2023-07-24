import { containerClass } from './Footer.css';

import React, { FC } from 'react';

export interface IFooterProps {
  children: React.ReactNode;
  // variant: keyof typeof footerVariants;
}

export const FooterContainer: FC<IFooterProps> = ({ children }) => {
  // const classList = classNames(containerClass, footerVariants[variant]);
  return (
    <footer className={containerClass} data-testid="kda-footer">
      {children}
    </footer>
  );
};
