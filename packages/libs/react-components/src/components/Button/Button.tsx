import { type SystemIcons } from '../Icons';

import { StyledButton } from './styles';

import React, { type FC } from 'react';

export interface IButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'as' | 'disabled'
  > {
  as?: 'button' | 'a';
  icon?: (typeof SystemIcons)[keyof typeof SystemIcons];
  onClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | React.FormEventHandler<HTMLButtonElement>;
  href?: string;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
  target?: string;
  rel?: string;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  icon,
  onClick,
  href,
  children,
  ...props
}) => {
  const Icon = icon;
  const ariaLabel = props['aria-label'] ?? props.title;

  return (
    <StyledButton
      {...props}
      as={as}
      onClick={as === 'button' ? onClick : undefined}
      href={as === 'a' ? href : undefined}
      aria-label={ariaLabel}
    >
      {children}
      {Icon && <Icon size="md" />}
    </StyledButton>
  );
};
