import { logoClass } from './NavHeader.css';

import { Link } from '@components/Link';
import Logo, { LogoVariant } from '@components/Logo';
import React, { FC } from 'react';

export interface INavHeaderLogoProps {
  brand?: LogoVariant;
}

export const NavHeaderLogo: FC<INavHeaderLogoProps> = ({
  brand = 'default',
}) => {
  return (
    <div className={logoClass}>
      <Link.Root href="/" target="_self">
        <Logo variant={brand} />
      </Link.Root>
    </div>
  );
};
