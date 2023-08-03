import React, { FC } from 'react';

import type { LogoVariant } from '@components/BrandLogo';

import { Link } from '@components/Link';
import Logo, { logoVariants } from '@components/BrandLogo';

import { containerClass, logoClass } from './NavHeader.css';

export type INavItemTarget = '_self' | '_blank';
export type INavItem = {
  title: string;
  href: string;
  target?: INavItemTarget;
};
export type INavItems = INavItem[];

export interface INavHeaderProps {
  brand?: LogoVariant;
  children?: React.ReactNode;
  items?: INavItems;
}

export const NavHeader: FC<INavHeaderProps> = ({
  brand = logoVariants[0],
  children,
}) => {
  return (
    <header className={containerClass} data-testid="kda-navheader">
      <div className={logoClass}>
        {logoVariants.includes(brand) && (
          <Link.Root href="/" target="_self">
            <Logo variant={brand} />
          </Link.Root>
        )}
      </div>
      {children}
    </header>
  );
};
