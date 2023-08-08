import { ulListClass } from './styles.css';

import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const UnorderedList: FC<IProp> = ({ children }) => {
  return <ul className={ulListClass}>{children}</ul>;
};
