import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';

export interface INavHeaderButtonProps extends IButtonProps {}

export const NavHeaderButton = ({
  className,
  ...props
}: INavHeaderButtonProps) => (
  <Button className={className} isCompact {...props} />
);
