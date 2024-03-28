import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';
import { iconButtonClass } from './NavHeader.css';

export type INavHeaderButtonLinkProps = IButtonProps & {
  className?: string;
};

export const NavHeaderButtonLink: FC<INavHeaderButtonLinkProps> = ({
  className,
  ...props
}) => {
  return (
    <Button className={cn(iconButtonClass, className)} isCompact {...props} />
  );
};
