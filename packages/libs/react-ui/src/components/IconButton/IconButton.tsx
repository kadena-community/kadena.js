import { SystemIcon } from '../';

import { colorVariants } from './IconButton.css';

import React, { FC } from 'react';

export interface IIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  as?: 'button' | 'a';
  icon: typeof SystemIcon[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  title: string;
  color?: keyof typeof colorVariants;
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

  if (as === 'a' && href !== undefined && href !== '') {
    return (
      <a className={colorVariants[color]} href={href} aria-label={ariaLabel}>
        <Icon size="md" />
      </a>
    );
  }

  return (
    <button
      {...props}
      className={colorVariants[color]}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon size="md" />
    </button>
  );
};
