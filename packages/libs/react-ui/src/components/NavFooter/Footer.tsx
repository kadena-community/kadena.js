import { containerClass, footerVariants } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterProps {
  variant?: keyof typeof footerVariants;
  children: React.ReactNode;
}

export const FooterContainer: FC<IFooterProps> = ({
  children,
  variant = 'dynamic',
}) => {
  const classList = classNames(containerClass, footerVariants[variant]);
  return (
    <footer className={classList} data-testid="kda-footer">
      {children}
    </footer>
  );
};
