import { footerVariants, linkBoxClass, linkClass } from './Footer.css';

import { FooterVariant } from '@components/Footer/Footer';
import classNames from 'classnames';
import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface IFooterLinkItemProps {
  children: React.ReactNode;
  variant?: FooterVariant;
}

export const FooterLinkItem: FC<IFooterLinkItemProps> = ({
  children,
  variant = 'web',
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
