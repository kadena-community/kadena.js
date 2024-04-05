import type { FC } from 'react';
import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';

export interface INavHeaderButtonProps extends IButtonProps {}

export const NavHeaderButton: FC<INavHeaderButtonProps> = ({
  className,
  ...props
}) => {
  return <Button className={className} isCompact {...props} />;
};
