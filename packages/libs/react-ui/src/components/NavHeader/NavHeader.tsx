import { Link } from '@components/Link';
import { containerClass, linkClass, logoClass, navClass } from './NavHeader.css';

import React, { FC } from 'react';
import Logo, { LogoVariant } from '@components/Logo';

export type INavItemTarget = '_self' | '_blank';
export type INavItems = { title: string; href: string; target?: INavItemTarget }[];

export interface INavHeaderProps {
  // children: React.ReactNode;
  brand?: LogoVariant;
  items?: INavItems;
}


export const NavHeader: FC<INavHeaderProps> = ({
  // children,
  brand,
  items,
}) => {
  return (
    <header className={containerClass} data-testid="kda-navheader">
      <div className={logoClass}>
      <Link.Root href="/" target="_self">
        <Logo variant={brand} />
      </Link.Root>
    </div>
      <nav className={navClass}>

        {items && items.map((item, index) => {
          return (
            <a className={linkClass} href={item.href} target={item.target} key={`nav-header-link-${index}`}>
              {item.title}
            </a>
          );
        })}
      </nav>
    </header>
  );
};
