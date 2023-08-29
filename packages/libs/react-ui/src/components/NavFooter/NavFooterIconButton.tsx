import { SystemIcon } from '..';

import { iconButtonClass, iconTextClass } from './NavFooter.css';

import React, { FC } from 'react';

export interface INavFooterIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: keyof typeof SystemIcon;
  onClick?: React.MouseEventHandler;
  text?: string;
}

export const NavFooterIconButton: FC<INavFooterIconButtonProps> = ({
  icon,
  onClick,
  text,
}) => {
  const Icon = icon && SystemIcon[icon];

  return (
    <button
      className={iconButtonClass}
      onClick={onClick}
      data-testid="kda-footer-icon-item"
    >
      {text !== undefined ? (
        <span className={iconTextClass}>{text}</span>
      ) : null}
      <Icon size="sm" color="inherit" />
    </button>
  );
};
