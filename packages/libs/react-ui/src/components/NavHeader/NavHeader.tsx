import { Link } from '@components/Link';
import {
  activeLinkClass,
  childrenClass,
  containerClass,
  glowClass,
  linkClass,
  logoClass,
  navListClass,
  navWrapperClass,
} from './NavHeader.css';

import classNames from 'classnames';

import React, { FC } from 'react';
import Logo, { LogoVariant, logoVariants } from '@components/Logo';
import { NavGlow } from './assets/glow';
import useGlow from './useGlow';

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
  items,
}) => {
  const {
    glowX,
    prevGlowX,
    activeNav,
    setActiveNav,
    glowRef,
    headerRef,
    navRef,
  } = useGlow();

  return (
    <header
      className={containerClass}
      ref={headerRef}
      data-testid="kda-navheader"
    >
      <div
        className={glowClass}
        style={{
          transform: `translateX(${glowX}px)`,
          transitionDuration: `${Math.abs(glowX - prevGlowX) * 2}ms`,
        }}
        ref={glowRef}
      >
        <NavGlow />
      </div>
      <div className={logoClass}>
        {logoVariants.includes(brand) && (
          <Link.Root href="/" target="_self">
            <Logo variant={brand} />
          </Link.Root>
        )}
      </div>
      <nav className={navWrapperClass} ref={navRef}>
        <ul className={navListClass}>
          {items &&
            items.map((item, index) => {
              return (
                <li
                  key={`navItem-${index}`}
                  onClick={() => setActiveNav(index + 1)}
                >
                  <a
                    className={classNames(linkClass, {
                      [activeLinkClass]: activeNav === index + 1,
                    })}
                    href={item.href}
                    target={item.target}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
        </ul>
      </nav>
      <div className={childrenClass}>{children}</div>
    </header>
  );
};
