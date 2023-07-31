import { footerVariants, linkBoxClass, linkClass } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface IFooterLinkProps {
  children: React.ReactNode;
  variant?: keyof typeof footerVariants;
}

export const FooterLink: FC<IFooterLinkProps> = ({
  children,
  variant = 'dynamic',
}) => {
  const colorStyles = {
    color: 'inherit',
    textDecorationColor: 'inherit',
  };

  const clones = React.Children.map(children, (child) => {
    // @ts-ignore
    return React.cloneElement(child, {
      classNames: [linkClass, footerVariants[variant]],
      style: colorStyles,
    });
  });

  const classList = classNames(linkBoxClass, footerVariants[variant]);

  return (
    <div className={classList} data-testid="kda-footer-link-item">
      <span className={linkClass}>{clones}</span>
    </div>
  );
};
