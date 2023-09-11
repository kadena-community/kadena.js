import type { FC } from 'react';
import React from 'react';

export interface INavHeaderSelectOptionProps
  extends Omit<React.HTMLAttributes<HTMLOptionElement>, 'as'> {
  children: React.ReactNode;
  value?: string[] | string | number;
}

export const NavHeaderSelectOption: FC<INavHeaderSelectOptionProps> = ({ children, ...rest }) => (
  <option {...rest}>{children}</option>
);
