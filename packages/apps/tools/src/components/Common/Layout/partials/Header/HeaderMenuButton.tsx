import { SystemIcon } from '@kadena/react-ui';
import type { ButtonHTMLAttributes, FC } from 'react';
import React from 'react';
import { headerButtonStyle } from './styles.css';

export interface IHeaderMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon: keyof typeof SystemIcon;
}

export const HeaderMenuButton: FC<IHeaderMenuButtonProps> = ({ title, icon, ...rest }) => {
  const Icon = SystemIcon[icon];

  return (
    <button className={headerButtonStyle} {...rest} aria-label={title}>
      <Icon />
    </button>
  );
};
