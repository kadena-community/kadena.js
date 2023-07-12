import { vars } from '../../styles';
import { SystemIcon } from '../';

import {
  ColorOptions,
  colorVariants,
  iconBoxClass,
  iconTextClass,
} from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';
import { vars } from '../../styles';

export interface IFooterIconItemProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler;
  text?: string;
  color?: keyof typeof colorVariants;
}

export const FooterIconItem: FC<IFooterIconItemProps> = ({
  color = 'default',
  icon,
  onClick,
  text,
}) => {
  const Icon = icon;
  const iconTextClassList = classNames(iconTextClass, colorVariants[color]);

  type ColorKey = keyof typeof vars.colors;
  const getColor = (color: string): string => {
    const contrast: ColorKey = `$${color}Contrast` as ColorKey;
    console.log(contrast);
    if (color === 'default') {
      return vars.colors.$neutral3;
    }

    if (color === 'inverted') {
      return vars.colors.$neutral2;
    }

    return vars.colors[contrast];
  };

  return (
    <div
      className={iconBoxClass}
      onClick={onClick}
      data-testid="kda-footer-icon-item"
    >
      {text !== undefined ? (
        <span className={iconTextClassList}>{text}</span>
      ) : null}
      <a>
        <Icon size="sm" color={getColor(color)} />
      </a>
    </div>
  );
};
