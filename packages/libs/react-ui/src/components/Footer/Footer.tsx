import { colorVariants, containerClass, footerVariants } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterProps {
  children: React.ReactNode;
  color: keyof typeof colorVariants;
  variant: keyof typeof footerVariants;
}

export const FooterContainer: FC<IFooterProps> = ({ children, variant }) => {
  const classList = classNames(containerClass, footerVariants[variant]);
  return (
    <footer className={classList} data-testid="kda-footer">
      {children}
    </footer>
  );
};
