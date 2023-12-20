import cn from 'classnames';
import type { DOMAttributes, FC } from 'react';
import React from 'react';
import { tagClass } from './Tag.css';

export interface ITagProps extends DOMAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export const Tag: FC<ITagProps> = ({ children, className, ...restProps }) => {
  return (
    <span className={cn(tagClass, className)} {...restProps}>
      {children}
    </span>
  );
};
