import cn from 'classnames';
import React from 'react';
import type { IButtonElementProps } from '../Button';
import { Button } from '../Button';
import { iconButtonClass } from './NavHeader.css';

export const NavHeaderButton = ({
  className,
  ...props
}: IButtonElementProps) => (
  <Button className={cn(iconButtonClass, className)} isCompact {...props} />
);
