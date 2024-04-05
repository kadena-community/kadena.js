import React from 'react';
import type { IButtonElementProps } from '../Button';
import { Button } from '../Button';

export const NavHeaderButton = ({
  className,
  ...props
}: IButtonElementProps) => (
  <Button className={className} isCompact {...props} />
);
