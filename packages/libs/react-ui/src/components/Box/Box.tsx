import { vars } from '../../styles';

import { marginVariants } from './Box.css';

import React, { FC } from 'react';

export interface IBoxProps {
  margin?: keyof typeof vars.sizes;
  children: React.ReactNode;
}

export const Box: FC<IBoxProps> = ({ children, margin = '$md' }) => {
  return <div className={marginVariants[margin]}>{children}</div>;
};
