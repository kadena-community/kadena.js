import { SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React, { useRef } from 'react';
import {
  headerButtonStyle,
} from './styles.css';

export interface IHeaderMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  icon: keyof typeof SystemIcon;
}

export const HeaderMenuButton: FC<IHeaderMenuButtonProps> = ({
 title,
 href,
 icon,
 ...rest
}) => {
  const Icon = SystemIcon[icon];

  const button = (
    <>
      <button
        className={headerButtonStyle}
        {...rest}
        aria-label={title}
      >
        <Icon />
      </button>
    </>
  );

  if (href) return <Link href={href}>{button}</Link>;
  return button;
};
