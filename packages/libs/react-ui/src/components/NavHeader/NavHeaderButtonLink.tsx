import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Link } from '../Link';
import type { ILinkProps } from '../Link/';
import { iconButtonClass } from './NavHeader.css';

export const NavHeaderButtonLink: FC<ILinkProps> = ({
  className,
  ...props
}) => {
  return (
    <Link className={cn(iconButtonClass, className)} isCompact {...props} />
  );
};
