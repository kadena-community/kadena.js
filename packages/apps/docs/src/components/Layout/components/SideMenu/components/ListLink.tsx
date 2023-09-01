import { linkClass } from './styles.css';

import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

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
