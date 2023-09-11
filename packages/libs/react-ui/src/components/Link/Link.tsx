import { SystemIcon } from '..';

import { inlineLinkClass, linkContainerClass } from './Link.css';

import classnames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ILinkProps {
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: ReactNode;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  asChild?: boolean;
  inline?: boolean;
}

export const Link: FC<ILinkProps> = ({
  children,
  icon,
  iconAlign = 'left',
  asChild = false,
  inline = false,
  ...restProps
}) => {
  const Icon = icon && SystemIcon[icon];

  const linkClasses = classnames(linkContainerClass, {
    [inlineLinkClass]: inline,
  });

  const getContents = (linkContents: ReactNode): ReactNode => (
    <>
      {Icon && iconAlign === 'left' && <Icon size="md" />}
      {linkContents}
      {Icon && iconAlign === 'right' && <Icon size="md" />}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      className: linkClasses,
      children: getContents(children.props.children),
    });
  }

  return (
    <a className={linkClasses} {...restProps}>
      {getContents(children)}
    </a>
  );
};
