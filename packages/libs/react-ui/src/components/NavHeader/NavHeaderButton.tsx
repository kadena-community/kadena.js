import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';
import { iconButtonClass } from './NavHeader.css';

export interface INavHeaderButtonProps extends IButtonProps {}

export const NavHeaderButton: FC<INavHeaderButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button className={cn(iconButtonClass, className)} isCompact {...props} />
  );
};
