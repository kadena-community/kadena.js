import cn from 'classnames';
import type { ComponentPropsWithRef, FC, ReactElement, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { darkThemeClass } from '../../styles';
import { NavHeaderContext } from './NavHeader.context';
import {
  containerClass,
  contentClass,
  itemsContainerClass,
  logoClass,
} from './NavHeader.css';

export interface INavHeaderProps extends ComponentPropsWithRef<'nav'> {
  logo: ReactElement;
  children: ReactNode;
  activeHref?: string;
  className?: string;
}

export const NavHeader: FC<INavHeaderProps> = ({
  logo,
  children,
  activeHref,
  className,
  ...props
}) => {
  const [_activeHref, setActiveHref] = useState<string | undefined>(activeHref);
  useEffect(() => {
    if (activeHref !== _activeHref) {
      setActiveHref(activeHref);
    }
  }, [activeHref]);

  return (
    <nav
      className={cn(darkThemeClass, containerClass, className)}
      aria-label="main"
      dir="ltr"
      {...props}
    >
      <div className={contentClass}>
        {React.cloneElement(logo, {
          className: cn(logoClass, logo.props.className),
        })}
        <NavHeaderContext.Provider
          value={{ activeHref: _activeHref, setActiveHref }}
        >
          <div className={itemsContainerClass}>{children}</div>
        </NavHeaderContext.Provider>
      </div>
    </nav>
  );
};
