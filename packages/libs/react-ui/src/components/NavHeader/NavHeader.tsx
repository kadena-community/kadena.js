import { containerClass, logoClass } from './NavHeader.css';

import type { LogoVariant } from '@components/BrandLogo';
import Logo, { logoVariants } from '@components/BrandLogo';
import { Link } from '@components/Link';
import React, { FC } from 'react';

export type INavItemTarget = '_self' | '_blank';
export interface INavItem {
  title: string;
  href: string;
  target?: INavItemTarget;
}
export type INavItems = INavItem[];

export interface INavHeaderContainerProps {
  brand?: LogoVariant;
  children?: React.ReactNode;
  items?: INavItems;
}

export const NavHeaderContainer: FC<INavHeaderContainerProps> = ({
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
