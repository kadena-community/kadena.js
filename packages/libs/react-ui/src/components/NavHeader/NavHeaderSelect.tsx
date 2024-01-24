import classNames from 'classnames';
import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { ISelectProps } from '../Form';
import { Select as BaseSelect } from '../Form';
import { selectContainerClass } from './NavHeader.css';

export interface INavHeaderSelectProps<T extends object = any>
  extends ISelectProps<T> {}

export const NavHeaderSelect: FC<INavHeaderSelectProps> = forwardRef<
  HTMLSelectElement,
  INavHeaderSelectProps
>(function Select({ children, className, ...props }, ref) {
  return (
    <BaseSelect
      {...props}
      className={classNames(className, selectContainerClass)}
    >
      {children}
    </BaseSelect>
  );
});
