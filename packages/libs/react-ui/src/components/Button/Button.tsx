import { SystemIcon } from '..';
import { colorVariants } from './Button.css';

import React, { ButtonHTMLAttributes, FC } from 'react';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  variant?: keyof typeof colorVariants;
  children: React.ReactNode;
  disabled?: boolean;
  href?: string;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  loading?: boolean;
  onClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | React.FormEventHandler<HTMLButtonElement>;
  target?: '_blank' | '_self';
  title?: string;
  color?: keyof typeof colorVariants;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  color = 'primary',
  onClick,
  href,
  children,
  ...props
}) => {
  const ariaLabel = props['aria-label'] ?? props.title;

  if (as === 'a' && href !== undefined && href !== '') {
    <a className={colorVariants[color]} href={href}>
      {children}
    </a>;
  }

  return (
    <button
      {...props}
      className={colorVariants[color]}
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid="kda-button"
    >
      {children}
    </button>
  );
};
