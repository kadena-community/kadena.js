import { colorVariants } from './Button.css';

import React, { FC } from 'react';

export interface IButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
  color?: keyof typeof colorVariants;
}

// TODO: Add icon support
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
    >
      {children}
    </button>
  );
};
