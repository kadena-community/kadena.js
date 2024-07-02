import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { labelClass } from './Label.css';

export interface ILabelProps extends ComponentPropsWithRef<'label'> {
  children: React.ReactNode;
}

/**
 * Internal Label component
 * @private
 */
export const Label: FC<ILabelProps> = ({ children, className, ...props }) => {
  return (
    <label className={cn(labelClass, className)} {...props}>
      {children}
    </label>
  );
};
