import { linkClass } from './NavHeader.css';

import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface INavHeaderLinkProps {
  title: string;
  href: string;
  target?: Target;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  title,
  href,
  target = '_self',
}) => {
  return (
    <a className={linkClass} href={href} target={target}>
      {title}
    </a>
  );
};
