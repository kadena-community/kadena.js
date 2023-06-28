import { linkContainerClass } from './Link.css';

import React, { FC, ReactNode } from 'react';

export interface ILinkProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: ReactNode;
}

export const Link: FC<ILinkProps> = ({ href, target = '_blank', children }) => {
  return (
    <a href={href} target={target} className={linkContainerClass}>
      {children}
    </a>
  );
};
