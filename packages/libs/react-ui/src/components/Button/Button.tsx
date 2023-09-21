import type { colorVariants, typeVariants } from './Button.css';
import {
  alternativeVariant,
  buttonLoadingClass,
  compactVariant,
  defaultVariant,
  iconLoadingClass,
} from './Button.css';

import { SystemIcon } from '@components/Icon';
import cn from 'classnames';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import React from 'react';

export interface IButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'as' | 'disabled' | 'className'
  > {
  as?: 'button' | 'a';
  color?: keyof typeof colorVariants;
  variant?: keyof typeof typeVariants;
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
  asChild?: boolean;
}

export const Button: FC<IButtonProps> = ({
  as = 'button',
  children,
  color = 'primary',
  variant = 'default',
  href,
  icon,
  iconAlign = 'right',
  loading,
  target,
  asChild = false,
  ...restProps
}) => {
  const ariaLabel = restProps['aria-label'] ?? restProps.title;
  const renderAsAnchor = as === 'a' && href !== undefined && href !== '';

  let Icon = icon && SystemIcon[icon];
  if (loading) {
    Icon = SystemIcon.Loading;
  }

  const buttonVariant = () => {
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
      href,
      ariaLabel,
      target,
      ...children.props,
      className: buttonClassname,
      children: getContents(children.props.children),
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
    >
      {getContents(children)}
    </button>
  );
};
