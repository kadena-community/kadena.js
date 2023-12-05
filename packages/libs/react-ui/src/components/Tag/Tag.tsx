import type { DOMAttributes, FC } from 'react';
import React from 'react';
import { tagClass } from './Tag.css';

export interface ITagProps extends DOMAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const Tag: FC<ITagProps> = ({ children, ...restProps }) => {
  return (
    <span className={tagClass} {...restProps}>
      {children}
    </span>
  );
};
