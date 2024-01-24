import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { LogoVariant } from '../BrandLogo';
import Logo, { logoVariants } from '../BrandLogo';
import { Link } from '../Link';
import {
  containerClass,
  itemsContainerClass,
  logoClass,
} from './NavHeader.css';
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
      <div className={itemsContainerClass}>{children}</div>
    </header>
  );
};
