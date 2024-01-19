'use client';
import classNames from 'classnames';
import type {
  ComponentPropsWithRef,
  FC,
  FunctionComponentElement,
} from 'react';
import React from 'react';
import { navListClass } from './NavHeader.css';
import type { INavHeaderLinkProps } from './NavHeaderLink';

export interface INavHeaderLinkListProps extends ComponentPropsWithRef<'ul'> {
  children: FunctionComponentElement<INavHeaderLinkProps>[];
}

export const NavHeaderLinkList: FC<INavHeaderLinkListProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <ul className={classNames(navListClass, className)} {...props}>
      {children}
    </ul>
  );
};
