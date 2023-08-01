import { SystemIcon } from '..';

import { iconButtonClass, iconTextClass } from './Footer.css';

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
