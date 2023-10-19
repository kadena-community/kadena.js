import { SystemIcon } from '@components/Icon';
import cn from 'classnames';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import React from 'react';
import type { colorVariants, typeVariants } from './Button.css';
import {
  activeClass,
  alternativeVariant,
  buttonLoadingClass,
  compactVariant,
  defaultVariant,
  iconLoadingClass,
} from './Button.css';

export interface IButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'as' | 'disabled' | 'className'
  > {
  active?: boolean;
  as?: 'button' | 'a';
  asChild?: boolean;
  children: React.ReactNode;
  color?: keyof typeof colorVariants;
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
  type?: 'button' | 'submit' | 'reset';
  variant?: keyof typeof typeVariants;
}

export const Button: FC<IButtonProps> = (
  {
    active = false,
    as = 'button',
    asChild = false,
    children,
    color = 'primary',
    href,
    icon,
    iconAlign = 'right',
    loading,
    target,
    title = '',
    type,
    variant = 'default',
    ...restProps
  },
) => {
  const ariaLabel = restProps['aria-label'] ?? title;
  const renderAsAnchor = as === 'a' && href !== undefined && href !== '';

  let Icon = icon && SystemIcon[icon];
  if (loading) {
    Icon = SystemIcon.Loading;
  }

  const buttonVariant = (): string => {
    switch (variant) {
      case 'compact':
        return compactVariant[color];
      case 'alternative':
        return alternativeVariant[color];
      default:
        return defaultVariant[color];
    }
  };

  const buttonClassname = cn(buttonVariant(), {
    [buttonLoadingClass]: loading,
    [activeClass]: active,
  });

  const iconClassname = cn({
    [iconLoadingClass]: loading,
  });

  const getContents = (linkContents: ReactNode): ReactNode => (
    <>
      {Icon && iconAlign === 'left' && (
        <Icon size="md" className={iconClassname} />
      )}
      {linkContents}
      {Icon && iconAlign === 'right' && (
        <Icon size="md" className={iconClassname} />
      )}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      ariaLabel,
      children: getContents(children.props.children),
      className: buttonClassname,
    });
  }

  if (renderAsAnchor) {
    return (
      <a
        aria-label={ariaLabel}
        className={buttonClassname}
        data-testid="kda-button"
        href={href}
        target={target}
      >
        {getContents(children)}
      </a>
    );
  }

  return (
    <button
      {...restProps}
      aria-label={ariaLabel}
      className={buttonClassname}
      data-testid="kda-button"
      type={type}
    >
      {getContents(children)}
    </button>
  );
};
