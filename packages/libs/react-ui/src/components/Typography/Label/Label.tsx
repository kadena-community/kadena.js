import type { FC } from 'react';
import React from 'react';
import { labelClass } from './Label.css';

export interface ILabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export const Label: FC<ILabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
};
