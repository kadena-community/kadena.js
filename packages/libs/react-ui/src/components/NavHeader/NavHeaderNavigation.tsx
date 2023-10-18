'use client';
import type { FC, FunctionComponentElement } from 'react';
import React, { useEffect, useState } from 'react';
import { glowClass, navListClass, navWrapperClass } from './NavHeader.css';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeaderNavigationContext } from './NavHeaderNavigation.context';
import { NavGlow } from './svg/glow';
import useGlow from './useGlow';

export interface INavHeaderNavigationProps {
  children: FunctionComponentElement<INavHeaderLinkProps>[];
  activeHref?: string;
}

export const NavHeaderNavigation: FC<INavHeaderNavigationProps> = ({
  children,
  activeHref,
}) => {
  const [_activeHref, setActiveHref] = useState<string | undefined>(activeHref);
  const { glowX, animationDuration, glowRef, navRef, setGlowPosition } =
    useGlow();

  useEffect(() => {
    if (activeHref !== _activeHref) setActiveHref(activeHref);
  }, [activeHref]);

  return (
    <NavHeaderNavigationContext.Provider
      value={{ setGlowPosition, activeHref: _activeHref, setActiveHref }}
    >
      <nav className={navWrapperClass} ref={navRef} aria-label="main" dir="ltr">
        <div
          role="none"
          className={glowClass}
          ref={glowRef}
          style={{
            opacity: glowX ? 1 : 0,
            transform: `translateX(${glowX}px)`,
            transitionDuration: `${animationDuration}ms`,
          }}
        >
          <NavGlow />
        </div>
        <ul className={navListClass}>{children}</ul>
      </nav>
    </NavHeaderNavigationContext.Provider>
  );
};
