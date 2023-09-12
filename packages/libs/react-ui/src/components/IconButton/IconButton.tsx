import { colorVariants, stateVariants } from './IconButton.css';

import { SystemIcon } from '@components/Icon';
import classnames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IIconButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  as?: 'button' | 'a';
  icon: keyof typeof SystemIcon;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  title: string;
  color?: keyof typeof colorVariants;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
  state?: 'active';
}

export const IconButton: FC<IIconButtonProps> = ({
  as = 'button',
  color = 'default',
  href,
  icon,
  title,
  children,
  asChild = false,
  state,
  ...restProps
}) => {
  const Icon = icon && SystemIcon[icon];
  const ariaLabel = restProps['aria-label'] ?? title;
  const classNames = classnames(colorVariants[color], {
    [stateVariants.positive]: color === 'positive' && state === 'active',
    [stateVariants.negative]: color === 'negative' && state === 'active',
  });

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      href,
      ariaLabel,
      ...children.props,
      className: classNames,
      children: <Icon size="md" />,
    });
  }

  if (as === 'a' && href !== undefined && href !== '') {
    return (
      <a className={classNames} href={href} aria-label={ariaLabel}>
        <Icon size="md" />
      </a>
    );
  }

  return (
    <button
      {...restProps}
      className={classNames}
      aria-label={ariaLabel}
      data-testid="kda-icon-button"
    >
      <Icon size="md" />
    </button>
  );
};
