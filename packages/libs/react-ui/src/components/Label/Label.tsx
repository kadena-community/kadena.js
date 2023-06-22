import { labelClass } from './Label.css';

import React, { FC } from 'react';

export interface ITextProps {
  htmlFor: string;
  children: React.ReactNode;
}

export const Label: FC<ITextProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
};
