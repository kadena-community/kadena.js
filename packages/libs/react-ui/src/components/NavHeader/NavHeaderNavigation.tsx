import { NavGlow } from './assets/glow';
import {
  activeLinkClass,
  glowClass,
  linkClass,
  navListClass,
  navWrapperClass,
} from './NavHeader.css';
import useGlow from './useGlow';

import classNames from 'classnames';
import React, { FC } from 'react';

export type INavItemTarget = '_self' | '_blank';
export interface INavItem {
  href: string;
  target?: INavItemTarget;
  title: string;
}
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
                HTMLElement,
                string | React.JSXElementConstructor<JSX.Element>
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
