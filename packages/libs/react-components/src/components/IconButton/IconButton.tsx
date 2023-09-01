import { type SystemIcons } from '../Icons';

import { StyledButton } from './styles';

import { type VariantProps } from '@stitches/react';
import React, { type FC } from 'react';

export interface IIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  as?: 'button' | 'a';
  icon: (typeof SystemIcons)[keyof typeof SystemIcons];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  title: string;
  color?: VariantProps<typeof StyledButton>['color'];
}

export const IconButton: FC<IIconButtonProps> = ({
  as = 'button',
  color = 'default',
  href,
  icon,
  onClick,
  title,
  ...props
}) => {
  const Icon = icon;
  const ariaLabel = props['aria-label'] ?? title;

  return (
    <StyledButton
      {...props}
      as={as}
      href={as === 'a' ? href : undefined}
      onClick={as === 'button' ? onClick : undefined}
      aria-label={ariaLabel}
      color={color}
    >
      <Icon size="md" />
    </StyledButton>
  );
};
