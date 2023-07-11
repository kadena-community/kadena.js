import { colorVariants } from './Button.css';

import React, { ButtonHTMLAttributes, FC } from 'react';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  target?: '_blank' | '_self';
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
  color?: keyof typeof colorVariants;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  color = 'primary',
  target,
  onClick,
  href,
  children,
  ...props
}) => {
  const ariaLabel = props['aria-label'] ?? props.title;
  const validAnchor = as === 'a' && href !== undefined && href !== '';

  if (validAnchor) {
    return (
      <a
        className={colorVariants[color]}
        href={href}
        target={target}
        aria-label={ariaLabel}
        data-testid="kda-button"
      >
        {children}
      </a>
    );
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
