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
  const linkClassList = classNames(iconBoxClass, colorVariants[color]);

  return (
    <div
      className={linkClassList}
      onClick={onClick}
      data-testid="kda-footer-icon-item"
    >
      {text !== undefined ? (
        <span className={iconTextClass}>{text}</span>
      ) : null}
      <a>
        <Icon size="sm" className={colorVariants[color]} />
      </a>
    </div>
  );
};
