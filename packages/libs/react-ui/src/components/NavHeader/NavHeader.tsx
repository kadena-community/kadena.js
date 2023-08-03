import classNames from 'classnames';
import React, { FC } from 'react';

import type { LogoVariant } from '@components/Logo';

import { Link } from '@components/Link';
import Logo, { logoVariants } from '@components/Logo';

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
    animationDuration,
    activeNav,
    setActiveNav,
    glowRef,
    headerRef,
    navRef,
  } = useGlow();

  return (
    <header
      className={containerClass}
      data-testid="kda-navheader"
      ref={headerRef}
    >
      <div
        className={glowClass}
        ref={glowRef}
        style={{
          transform: `translateX(${glowX}px)`,
          transitionDuration: `${animationDuration}ms`,
        }}
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
