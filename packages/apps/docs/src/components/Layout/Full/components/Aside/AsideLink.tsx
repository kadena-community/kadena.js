import {
  asideItemClass,
  asideItemLinkActiveVariants,
  asideItemLinkClass,
} from './styles.css';

import classNames from 'classnames';
import Link from 'next/link';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

export const AsideLink: FC<IProps> = ({
  children,
  href,
  label,
  isActive,
  onClick,
}) => {
  const linkClass = classNames(
    asideItemLinkClass,
    asideItemLinkActiveVariants[isActive ? 'true' : 'false'],
  );

  return (
    <li className={asideItemClass}>
      <Link href={href} onClick={onClick} className={linkClass}>
        {label}
      </Link>
      {children}
    </li>
  );
};
