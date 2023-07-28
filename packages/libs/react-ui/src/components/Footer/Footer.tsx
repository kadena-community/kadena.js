import { containerClass, footerVariants } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export type FooterVariant = 'web' | 'application';

export interface IFooterProps {
  variant?: FooterVariant;
  children: React.ReactNode;
}

export const FooterContainer: FC<IFooterProps> = ({
  children,
  variant = 'application',
}) => {
  const classList = classNames(containerClass, footerVariants[variant]);
  return (
    <footer className={classList} data-testid="kda-footer">
      {children}
    </footer>
  );
};
