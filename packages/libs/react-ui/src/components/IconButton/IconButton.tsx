import { SystemIcon } from '../';

import { colorVariants, container, invertedVariant } from './IconButton.css';

import React, { FC } from 'react';

export interface IIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  as?: 'button' | 'a';
  icon: typeof SystemIcon[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  title: string;
  color?: 'default' | 'inverted' | keyof typeof colorVariants;
}

export const IconButton: FC<IIconButtonProps> = ({
  as = 'button',
  color = 'default',
  href,
  icon,
  onClick,
  title,
  ...props
}) => {
  const Icon = icon;
  const ariaLabel = props['aria-label'] ?? title;

  const className =
    color === 'default'
      ? container
      : color === 'inverted'
      ? invertedVariant
      : colorVariants[color];

  return as === 'button' ? (
    <button
      {...props}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon size="md" />
    </button>
  ) : (
    <a className={className} href={href} aria-label={ariaLabel}>
      <Icon size="md" />
    </a>
  );
};
