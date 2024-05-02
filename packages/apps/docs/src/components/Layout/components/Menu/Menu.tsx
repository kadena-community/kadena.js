import classNames from 'classnames';
import type {
  ForwardRefExoticComponent,
  ForwardedRef,
  ReactNode,
  RefAttributes,
} from 'react';
import React, { forwardRef } from 'react';
import {
  menuClass,
  menuInLayoutVariants,
  menuLayoutVariants,
  menuOpenVariants,
} from './menu.css';

interface IProps {
  children?: ReactNode;
  dataCy?: string;
  isOpen?: boolean;
  inLayout?: boolean;
  layout: 'landing' | 'normal';
  style?: React.CSSProperties;
  ref?: ForwardedRef<HTMLDivElement>;
}

export const Menu: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, IProps>(
  (
    {
      children,
      dataCy,
      isOpen = false,
      inLayout = false,
      layout = 'normal',
      style,
    },
    ref,
  ) => {
    const classes = classNames(
      menuClass,
      menuOpenVariants[isOpen ? 'isOpen' : 'isClosed'],
      menuInLayoutVariants[inLayout ? 'true' : 'false'],
      menuLayoutVariants[layout],
    );

    return (
      <div data-cy={dataCy} className={classes} style={style} ref={ref}>
        {children}
      </div>
    );
  },
);

Menu.displayName = 'Menu';
