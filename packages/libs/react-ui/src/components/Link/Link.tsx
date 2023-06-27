import { SystemIcon } from '../Icons';

import { iconContainerClass, linkContainerClass } from './Link.css';

import React from 'react';

export interface ILinkProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hasIcon?: boolean;
}

export const Link: React.FC<ILinkProps> = ({
  href,
  target = '_blank',
  children,
  iconPosition = 'right',
  hasIcon = true,
}) => {
  return (
    <a href={href} target={target} className={linkContainerClass}>
      {hasIcon && iconPosition === 'left' && (
        <span className={iconContainerClass}>
          <SystemIcon.Link size="md" />
        </span>
      )}
      {children}
      {hasIcon && iconPosition === 'right' && (
        <span className={iconContainerClass}>
          <SystemIcon.Link size="md" />
        </span>
      )}
    </a>
  );
};
