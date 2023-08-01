import { SystemIcon } from '..';

import { footerVariants, iconButtonClass, iconTextClass } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler;
  text?: string;
  variant?: keyof typeof footerVariants;
}

export const FooterIconButton: FC<IFooterIconButtonProps> = ({
  icon,
  onClick,
  text,
  variant = 'dynamic',
}) => {
  const Icon = icon;

  const buttonClassList = classNames(iconButtonClass, footerVariants[variant]);
  const textClassList = classNames(iconTextClass, footerVariants[variant]);

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
