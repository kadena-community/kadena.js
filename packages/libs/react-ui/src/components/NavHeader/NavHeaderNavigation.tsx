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
import React, {
  FC,
  FunctionComponentElement,
  HTMLAttributeAnchorTarget,
} from 'react';

export interface INavItem {
  active?: boolean;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: HTMLAttributeAnchorTarget;
}
export type INavItems = INavItem[];

export interface INavHeaderNavigationProps {
  children: FunctionComponentElement<INavItem>[];
  activeLink?: number;
}

export const NavHeaderNavigation: FC<INavHeaderNavigationProps> = ({
  children,
  activeLink,
}) => {
  const { glowX, animationDuration, glowRef, navRef, activeNav, setActiveNav } =
    useGlow(activeLink);

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
                HTMLElement | INavItem,
                string | React.JSXElementConstructor<JSX.Element & INavItem>
              >,
              {
                active: activeNav === index + 1,
                className: classNames(linkClass, {
                  [activeLinkClass]: activeNav === index + 1,
                  'nav-item': true,
                }),
              },
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
