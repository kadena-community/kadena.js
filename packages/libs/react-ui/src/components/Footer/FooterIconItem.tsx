import { SystemIcon } from '../';

import { colorVariants, iconBoxClass, iconTextClass } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterIconItemProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler;
  title: string;
  text?: string;
  color?: keyof typeof colorVariants;
}

export const FooterIconItem: FC<IFooterIconItemProps> = ({
  color = 'default',
  icon,
  onClick,
  title,
  text,
  ...props
}) => {
  const Icon = icon;
  const iconTextClassList = classNames(iconTextClass, colorVariants[color]);

  type ColorKey = keyof typeof vars.colors;
  const getColor = (color: string): string => {
    const contrast: ColorKey = `$${color}Contrast` as ColorKey;

    if (color === 'default') {
      return vars.colors.$neutral3;
    }

    if (color === 'inverted') {
      return vars.colors.$neutral2;
    }

    return vars.colors[contrast];
  };

  return (
    <button
      className={iconBoxClass}
      onClick={onClick}
      data-testid="kda-footer-icon-item"
    >
      {text !== undefined ? (
        <span className={iconTextClassList}>{text}</span>
      ) : null}
      <Icon size="sm" color={getColor(color)} />
    </button>
  );
};
