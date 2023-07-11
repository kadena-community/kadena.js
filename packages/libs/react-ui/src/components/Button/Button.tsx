import { colorVariants } from './Button.css';

import React, { ButtonHTMLAttributes, FC } from 'react';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  color?: keyof typeof colorVariants;
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
  iconAlign?: 'left' | 'right';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  target?: '_blank' | '_self';
  title?: string;
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
