import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { olListClass } from './styles.css';

interface IProp {
  children: FunctionComponentElement<HTMLOListElement>[];
}

export const OrderedList: FC<IProp> = ({ children }) => {
  return <ol className={olListClass}>{children}</ol>;
};
