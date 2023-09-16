import { colorVariants } from './IconButton.css';

import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';

export interface IIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color' | 'className'> {
  as?: 'button' | 'a';
  icon: keyof typeof SystemIcon;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  title: string;
  color?: keyof typeof colorVariants;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
}

export const IconButton: FC<IIconButtonProps> = ({
  as = 'button',
  color = 'default',
  href,
  icon,
  title,
  children,
  asChild = false,
  ...restProps
}) => {
  const Icon = icon && SystemIcon[icon];
  const ariaLabel = restProps['aria-label'] ?? title;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      href,
      ariaLabel,
      ...children.props,
      className: colorVariants[color],
      children: <Icon size="md" />,
    });
  }

  if (as === 'a' && href !== undefined && href !== '') {
    return (
      <a className={colorVariants[color]} href={href} aria-label={ariaLabel}>
        <Icon size="md" />
      </a>
    );
  }

  return (
    <button
      {...restProps}
      className={colorVariants[color]}
      aria-label={ariaLabel}
      data-testid="kda-icon-button"
    >
      <Icon size="md" />
    </button>
  );
};
