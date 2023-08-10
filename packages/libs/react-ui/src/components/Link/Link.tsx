import { SystemIcon } from '..';

import { linkContainerClass } from './Link.css';
import { LinkIcon } from './LinkIcon';

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
  iconAlign,
}) => {
  const Icon = icon && SystemIcon[icon];

  const buttonChildren = (
    <>
      {Icon && iconAlign === 'left' && <LinkIcon icon={Icon} />}
      {children}
      {Icon && iconAlign === 'right' && <LinkIcon icon={Icon} />}
    </>
  );

  return (
    <a href={href} target={target} className={linkContainerClass}>
      {buttonChildren}
    </a>
  );
};
