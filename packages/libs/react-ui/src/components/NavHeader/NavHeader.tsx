import type { LogoVariant } from '@components/BrandLogo';
import Logo, { logoVariants } from '@components/BrandLogo';
import { Link } from '@components/Link';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { containerClass, logoClass } from './NavHeader.css';
import type { INavHeaderContentProps } from './NavHeaderContent';
import type { INavHeaderNavigationProps } from './NavHeaderNavigation';

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
    <header className={containerClass}>
      {logoVariants.includes(brand) && (
        <div className={logoClass}>
          <Link href="/" target="_self">
            <Logo variant={brand} />
          </Link>
        </div>
      )}
      {children}
    </header>
  );
};
