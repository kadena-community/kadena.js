import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { useSeparator } from 'react-aria';
import { dividerClass } from './Divider.css';

export interface IDividerProps extends ComponentPropsWithRef<'hr'> {}

export const Divider: FC<IDividerProps> = ({ className, ...props }) => {
  const { separatorProps } = useSeparator({
    ...props,
    elementType: 'hr',
    orientation: 'horizontal',
  });
  return <hr className={cn(dividerClass, className)} {...separatorProps} />;
};
