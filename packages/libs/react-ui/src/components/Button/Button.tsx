import { colorVariants } from './Button.css';

import React, { ButtonHTMLAttributes, FC } from 'react';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
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
