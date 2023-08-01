import { SystemIcon } from '..';

import { iconButtonClass, iconTextClass } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler;
  text?: string;
}

export const FooterIconButton: FC<IFooterIconButtonProps> = ({
  icon,
  onClick,
  text,
}) => {
  const Icon = icon;

  const buttonClassList = classNames(iconButtonClass);
  const textClassList = classNames(iconTextClass);

  return (
    <button
      className={buttonClassList}
      onClick={onClick}
      data-testid="kda-footer-icon-item"
    >
      {text !== undefined ? (
        <span className={textClassList}>{text}</span>
      ) : null}
      <Icon size="sm" color="inherit" />
    </button>
  );
};
