import { SystemIcon } from '..';

import { blockLinkClass, linkContainerClass } from './Link.css';

import classnames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ILinkProps {
  asChild?: boolean;
  block?: boolean;
  children: ReactNode;
  href?: string;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export const Link: FC<ILinkProps> = ({
  asChild = false,
  block = false,
  children,
  icon,
  iconAlign = 'left',
  ...restProps
}) => {
  const Icon = icon && SystemIcon[icon];

  const linkClasses = classnames(linkContainerClass, {
    [blockLinkClass]: block,
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
