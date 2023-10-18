import { SystemIcon } from '@components/Icon';
import classnames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { colorVariants, typeVariants } from './IconButton.css';
import {
  activeClass,
  alternativeVariant,
  compactVariant,
  defaultVariant,
} from './IconButton.css';

export interface IIconButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  active?: boolean;
  as?: 'button' | 'a';
  asChild?: boolean;
  color?: keyof typeof colorVariants;
  href?: string;
  icon: keyof typeof SystemIcon;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  target?: '_blank' | '_self';
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: keyof typeof typeVariants;
}

export const IconButton: FC<IIconButtonProps> = ({
  as = 'button',
  color = 'primary',
  variant = 'compact',
  href,
  icon,
  title,
  children,
  target,
  type,
  asChild = false,
  active = false,
  ...restProps
}) => {
  const ariaLabel = restProps['aria-label'] ?? title;
  const renderAsAnchor = as === 'a' && href !== undefined && href !== '';

  const Icon = icon && SystemIcon[icon];

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

  const buttonClassname = classnames(buttonVariant(), {
    [activeClass]: active,
  });

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      href,
      ariaLabel,
      type,
      ...children.props,
      className: buttonClassname,
      children: <Icon size="md" />,
    });
  }

  if (renderAsAnchor) {
    return (
      <a
        className={buttonClassname}
        href={href}
        target={target}
        aria-label={ariaLabel}
      >
        <Icon size="md" />
      </a>
    );
  }

  return (
    <button
      {...restProps}
      className={buttonClassname}
      aria-label={ariaLabel}
      data-testid="kda-icon-button"
      type={type}
    >
      <Icon size="md" />
    </button>
  );
};
