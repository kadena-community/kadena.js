import { SystemIcon } from '../';

import { footerVariants, iconButtonClass, iconTextClass } from './Footer.css';

import { FooterVariant } from '@components/Footer/Footer';
import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterIconItemProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  onClick?: React.MouseEventHandler;
  text?: string;
  variant?: FooterVariant;
}

export const FooterIconItem: FC<IFooterIconItemProps> = ({
  icon,
  onClick,
  text,
  variant = 'web',
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
