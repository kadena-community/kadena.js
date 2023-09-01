import {
  menuClass,
  menuInLayoutVariants,
  menuLayoutVariants,
  menuOpenVariants,
} from './menu.css';

import classNames from 'classnames';
import React, { type FC, type ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  dataCy?: string;
  isOpen?: boolean;
  inLayout?: boolean;
  layout: 'landing' | 'normal';
}

export const Menu: FC<IProps> = ({
  children,
  dataCy,
  isOpen = false,
  inLayout = false,
  layout = 'normal',
}) => {
  const classes = classNames(
    menuClass,
    menuOpenVariants[isOpen ? 'isOpen' : 'isClosed'],
    menuInLayoutVariants[inLayout ? 'true' : 'false'],
    menuLayoutVariants[layout],
  );

  return (
    <div data-cy={dataCy} className={classes}>
      {children}
    </div>
  );
};
