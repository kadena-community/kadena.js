import { linkBoxClass, linkClass } from './NavFooter.css';

import classNames from 'classnames';
import React, { type FC, type HTMLAttributeAnchorTarget } from 'react';

export type Target = '_self' | '_blank';
export interface INavFooterLinkProps {
  children: string;
  href?: string;
  target?: HTMLAttributeAnchorTarget | undefined;
}

export const NavFooterLink: FC<INavFooterLinkProps> = ({
  children,
  href,
  target,
}) => {
  return (
    <div className={linkBoxClass} data-testid="kda-footer-link-item">
      {href !== undefined ? (
        <a className={classNames(linkClass)} href={href} target={target}>
          {children}
        </a>
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
};
