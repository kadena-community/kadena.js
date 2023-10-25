import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { ulListClass } from './styles.css';

interface IProp {
  children: FunctionComponentElement<HTMLUListElement>[];
}

export const UnorderedList: FC<IProp> = ({ children }) => {
  return <ul className={ulListClass}>{children}</ul>;
};
