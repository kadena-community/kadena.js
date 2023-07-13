import { colorVariants } from './Button.css';
import { ButtonIcon } from './ButtonIcon';

import { SystemIcon } from '@components/Icon';
import React, { ButtonHTMLAttributes, FC } from 'react';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  as?: 'button' | 'a';
  color?: keyof typeof colorVariants;
  children: React.ReactNode;
  disabled?: boolean;
  href?: string;
  icon?: keyof typeof SystemIcon;
  iconAlign?: 'left' | 'right';
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  target?: '_blank' | '_self';
  title?: string;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  children,
  color = 'primary',
  href,
  icon,
  iconAlign,
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

  if (renderAsAnchor) {
    return (
      <a
        aria-label={ariaLabel}
        className={colorVariants[color]}
        data-testid="kda-button"
        href={href}
        target={target}
      >
        {loading && Icon && iconAlign === 'left' && <ButtonIcon icon={Icon} />}
        {children}
        {loading && Icon && iconAlign === 'right' && <ButtonIcon icon={Icon} />}
      </a>
    );
  }

  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={colorVariants[color]}
      data-testid="kda-button"
      onClick={onClick}
    >
      {loading && Icon && iconAlign === 'left' && <ButtonIcon icon={Icon} />}
      {children}
      {loading && Icon && iconAlign === 'right' && <ButtonIcon icon={Icon} />}
    </button>
  );
};
