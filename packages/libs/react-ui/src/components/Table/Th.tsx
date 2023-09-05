import { thClass } from './Table.css';

import type { FC } from 'react';
import React from 'react';

export interface IThProps {
  children?: React.ReactNode;
}

export const Th: FC<IThProps> = ({ children }) => {
  return <th className={thClass}>{children}</th>;
};
