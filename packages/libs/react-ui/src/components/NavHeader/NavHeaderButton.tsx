import type { IButtonProps } from '@components/Button';
import { Button } from '@components/Button';
import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
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
