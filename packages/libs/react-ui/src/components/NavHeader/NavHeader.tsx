import { Link } from '@components/Link';
import {
  containerClass,
  childrenClass,
  linkClass,
  activeLinkClass,
  logoClass,
  navWrapperClass,
  navListClass,
  glowClass,
} from './NavHeader.css';

import classNames from 'classnames';

import React, { FC, useState, useRef, useEffect } from 'react';
import Logo, { LogoVariant, logoVariants } from '@components/Logo';
import { NavGlow } from './assets/glow';

export type INavItemTarget = '_self' | '_blank';
export type INavItem = { title: string; href: string; target?: INavItemTarget };
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
  const headerRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLInputElement>(null);
  const glowRef = useRef<HTMLInputElement>(null);

  const [glowX, setGlowX] = useState(0);
  const [activeNav, setActiveNav] = useState(0);

  useEffect(() => {
    const activeNavElement = navRef.current?.querySelector(
      `li:nth-child(${activeNav}) a`,
    );
    const headerBounds = headerRef.current?.getBoundingClientRect();
    const activeNavBounds = activeNavElement?.getBoundingClientRect();
    const glowBounds = glowRef.current?.getBoundingClientRect();

    setGlowX(
      activeNav === 0
        ? -glowBounds!.width / 2
        : activeNavBounds!.x -
            headerBounds!.x -
            glowBounds!.width / 2 +
            activeNavBounds!.width / 2,
    );
  }, [glowX, activeNav]);
  return (
    <header
      className={containerClass}
      ref={headerRef}
      data-testid="kda-navheader"
    >
      <div
        className={glowClass}
        style={{ transform: `translateX(${glowX}px)` }}
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
