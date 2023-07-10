import { optionClass } from './Select.css';

import React, { FC } from 'react';

export interface IOptionProps
  extends Omit<React.HTMLAttributes<HTMLOptionElement>, 'as'> {
  children: React.ReactNode;
  value?: string[] | string | number;
}

export const Option: FC<IOptionProps> = ({ children, ...rest }) => (
  <option className={optionClass} {...rest}>
    {children}
  </option>
);
