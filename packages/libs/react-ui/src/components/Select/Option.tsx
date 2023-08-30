import { optionClass } from './Select.css';

import type { FC } from 'react';
import React from 'react';

export interface IOptionProps
  extends Omit<React.HTMLAttributes<HTMLOptionElement>, 'as'> {
  children: React.ReactNode;
  value?: string[] | string | number;
}

export const Option: FC<IOptionProps> = ({ children, ...rest }) => (
  <option {...rest}>{children}</option>
);
