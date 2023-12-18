import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { dividerClass } from './Divider.css';

export interface IDividerProps extends ComponentPropsWithRef<'hr'> {}

export const Divider: FC<IDividerProps> = ({ className, ...props }) => {
  return <hr className={cn(dividerClass, className)} {...props} />;
};
