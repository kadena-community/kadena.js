import { containerClass, logoClass } from './NavHeader.css';
import type { INavHeaderContentProps } from './NavHeaderContent';
import type { INavHeaderNavigationProps } from './NavHeaderNavigation';

import type { LogoVariant } from '@components/BrandLogo';
import Logo, { logoVariants } from '@components/BrandLogo';
import { Link } from '@components/Link';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';

export type INavItemTarget = '_self' | '_blank';
export interface INavItem {
  label: string;
  href: string;
  target?: INavItemTarget;
}
export type INavItems = INavItem[];

export interface INavHeaderRootProps {
  brand?: LogoVariant;
  children?: FunctionComponentElement<
    INavHeaderNavigationProps | INavHeaderContentProps
  >[];
}

export const NavHeaderContainer: FC<INavHeaderRootProps> = ({
  brand = logoVariants[0],
  children,
}) => {
  return (
    <header className={containerClass} data-testid="kda-navheader">
      <div className={logoClass}>
        {logoVariants.includes(brand) && (
          <Link href="/" target="_self">
            <Logo variant={brand} />
          </Link>
        )}
      </div>
      {children}
    </header>
  );
};
