import classNames from 'classnames';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React from 'react';
import { gridMiniMenuLinkButtonStyle } from './styles.css';

export interface IMenuLinkButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  active?: boolean;
  target?: string;
}

export const MenuLinkButton: FC<IMenuLinkButtonProps> = ({
  active,
  title,
  href,
  target = '_self',
  ...rest
}) => {
  const button = (
    <>
      <button
        className={classNames(gridMiniMenuLinkButtonStyle, { active })}
        {...rest}
        aria-label={title}
      >
        {title}
      </button>
    </>
  );

  if (href) return <Link href={href}>{button}</Link>;
  return button;
};
