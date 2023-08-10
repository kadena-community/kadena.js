import { linkBoxClass, linkClass } from './NavFooter.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface INavFooterLinkProps {
  children: string;
  href?: string;
  target?: Target;
}

export const NavFooterLink: FC<INavFooterLinkProps> = ({
  children,
  href,
  target,
}) => {
  return (
    <div className={linkBoxClass} data-testid="kda-footer-link-item">
      <span
        className={classNames(linkClass, {
          color: 'inherit',
          textDecorationColor: 'inherit',
        })}
      >
        {href !== undefined ? (
          <a
            style={{
              color: 'inherit',
              textDecorationColor: 'inherit',
            }}
            href={href}
            target={target}
          >
            {children}
          </a>
        ) : (
          <span>{children}</span>
        )}
      </span>
    </div>
  );
};
