import { SystemIcon } from '..';

import { linkContainerClass } from './Link.css';

import React, { FC, ReactNode } from 'react';

export interface ILinkProps {
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: ReactNode;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  asChild?: boolean;
}

export const Link: FC<ILinkProps> = ({
  children,
  icon,
  iconAlign = 'left',
  asChild = false,
  ...restProps
}) => {
  const Icon = icon && SystemIcon[icon];

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
      className: linkContainerClass,
      children: getContents(children.props.children),
    });
  }

  return (
    <a className={linkContainerClass} {...restProps}>
      {getContents(children)}
    </a>
  );
};
