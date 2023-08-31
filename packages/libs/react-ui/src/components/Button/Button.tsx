import {
  buttonLoadingClass,
  colorVariants,
  iconLoadingClass,
} from './Button.css';

import { SystemIcon } from '@components/Icon';
import cn from 'classnames';
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
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  children,
  variant = 'primary',
  href,
  icon,
  iconAlign = 'right',
  loading,
  onClick,
  target,
  ...props
}) => {
  const ariaLabel = props['aria-label'] ?? props.title;
  const renderAsAnchor = as === 'a' && href !== undefined && href !== '';

  let Icon = icon && SystemIcon[icon];
  if (loading) {
    Icon = SystemIcon.Loading;
  }

  const buttonClassname = cn(colorVariants[variant], {
    [buttonLoadingClass]: loading,
  });

  const iconClassname = cn({
    [iconLoadingClass]: loading,
  });

  const buttonChildren = (
    <>
      {Icon && iconAlign === 'left' && (
        <Icon size="md" className={iconClassname} />
      )}
      {children}
      {Icon && iconAlign === 'right' && (
        <Icon size="md" className={iconClassname} />
      )}
    </>
  );

  if (renderAsAnchor) {
    return (
      <a
        aria-label={ariaLabel}
        className={buttonClassname}
        data-testid="kda-button"
        href={href}
        target={target}
      >
        {buttonChildren}
      </a>
    );
  }

  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={buttonClassname}
      data-testid="kda-button"
      onClick={onClick}
    >
      {buttonChildren}
    </button>
  );
};
