import React from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';

export const NavHeaderButton = ({ className, ...props }: IButtonProps) => (
  <Button className={className} isCompact {...props} />
);
