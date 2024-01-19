import type { ILinkProps } from '@components/Link';
import { Link } from '@components/Link';
import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { iconButtonClass } from './NavHeader.css';

export interface INavHeaderButtonLinkProps extends ILinkProps {}

export const NavHeaderButtonLink: FC<INavHeaderButtonLinkProps> = ({
  className,
  ...props
}) => {
  return (
    <Link
      className={cn(iconButtonClass, className)}
      isCompact
      variant={'contained'}
      {...props}
    />
  );
};
