import { thClass } from './Table.css';

import React, { FC } from 'react';

export interface ITHead {
  children?: React.ReactNode;
}

export const Th: FC<ITHead> = ({ children }) => {
  return <th className={thClass}>{children}</th>;
};
