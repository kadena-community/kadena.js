import { SystemIcon } from '..';
import { linkContainerClass } from './Link.css';

import React, { FC, ReactNode } from 'react';

export interface ILinkProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  //variant?: keyof typeof colorVariants;
  children: ReactNode;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  loading?: boolean;
}

export const Link: FC<ILinkProps> = ({
  href, target = '_blank', children,
  icon, iconAlign, loading

}) => {
  return (
    <a href={href} target={target} className={linkContainerClass}>
      {children}
    </a>
  );
};
