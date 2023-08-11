import { SystemIcon } from '..';

import { linkContainerClass } from './Link.css';

import React, { FC, ReactNode } from 'react';

export interface ILinkProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: ReactNode;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
}

export const Link: FC<ILinkProps> = ({
  href,
  target = '_blank',
  children,
  icon,
  iconAlign = 'left',
}) => {
  const Icon = icon && SystemIcon[icon];

  const linkChildren = (
    <>
      {Icon && iconAlign === 'left' && <Icon size="md" />}
      {children}
      {Icon && iconAlign === 'right' && <Icon size="md" />}
    </>
  );

  return (
    <a href={href} target={target} className={linkContainerClass}>
      {linkChildren}
    </a>
  );
};
