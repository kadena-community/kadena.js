import cn from 'classnames';
import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';
import { iconButtonClass } from './NavHeader.css';

export interface INavHeaderButtonProps extends IButtonProps {}

export const NavHeaderButton = ({
  className,
  ...props
}: INavHeaderButtonProps) => (
  <Button
    className={cn(iconButtonClass, className)}
    isCompact
    variant="transparent"
    {...props}
  />
);
