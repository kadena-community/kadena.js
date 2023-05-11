import { buttonVariants } from './Button.css';

import React, { FC } from 'react';

export interface IButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
  variant?: keyof typeof buttonVariants;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  variant = 'primaryFilled',
  onClick,
  href,
  children,
  ...props
}) => {
  const ariaLabel = props['aria-label'] ?? props.title;

  if (as === 'a' && !href) {
    <a className={buttonVariants[variant]} href={href}>
      {children}
    </a>;
  }

  return (
    <button
      {...props}
      className={buttonVariants[variant]}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
