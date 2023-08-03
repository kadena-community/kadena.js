import classNames from 'classnames';
import React, { FC } from 'react';

import type { LogoVariant } from '@components/Logo';

import {
  activeLinkClass,
  linkClass,
  navListClass,
  navWrapperClass,
  glowClass,
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

export interface INavHeaderNavigationProps {
  children: React.ReactNode;
}

export const NavHeaderNavigation: FC<INavHeaderNavigationProps> = ({
  children,
}) => {
  const { glowX, animationDuration, glowRef, navRef, activeNav, setActiveNav } =
    useGlow();

  return (
    <nav className={navWrapperClass} ref={navRef}>
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
      <ul className={navListClass}>
        {React.Children.map(children, (child, index) => (
          <li key={`navItem-${index}`} onClick={() => setActiveNav(index + 1)}>
            {React.cloneElement(
              child as React.ReactElement<
                any,
                string | React.JSXElementConstructor<any>
              >,
              {
                className: classNames(linkClass, {
                  [activeLinkClass]: activeNav === index + 1,
                }),
              },
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
