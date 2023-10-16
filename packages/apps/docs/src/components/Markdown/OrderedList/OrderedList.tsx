import { olListClass } from './styles.css';

import type { FC, FunctionComponentElement } from 'react';
import React from 'react';

interface IProp {
  children: FunctionComponentElement<HTMLOListElement>[];
}

export const OrderedList: FC<IProp> = ({ children }) => {
  return <ol className={olListClass}>{children}</ol>;
};
