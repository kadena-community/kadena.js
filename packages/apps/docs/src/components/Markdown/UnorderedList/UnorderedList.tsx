import { ulListClass, ulListClassName } from './styles.css';

import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const UnorderedList: FC<IProp> = ({ children }) => {
  return (
    <ul className={classNames(ulListClass, ulListClassName)}>{children}</ul>
  );
};
