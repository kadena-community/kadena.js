import { optionClass } from './Select.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IOptionProps
  extends Omit<
    React.HTMLAttributes<HTMLOptionElement>,
    'as' | 'children' | 'className' | 'value'
  > {
  children: React.ReactNode;
  value: string[] | string | number;
}

export const Option: FC<IOptionProps> = ({ children, ...rest }) => (
  <option className={classNames(optionClass)} {...rest}>
    {children}
  </option>
);
