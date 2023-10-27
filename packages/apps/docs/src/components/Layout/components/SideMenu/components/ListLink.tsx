import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { linkClass } from './styles.css';

interface IProps {
  children: ReactNode;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  hasSubMenu: boolean;
}

export const ListLink: FC<IProps> = ({
  children,
  onClick,
  href,
  hasSubMenu,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-hassubmenu={hasSubMenu}
      className={linkClass}
    >
      {children}
    </Link>
  );
};
