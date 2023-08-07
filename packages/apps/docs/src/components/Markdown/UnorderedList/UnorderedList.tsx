import { ulList } from './styles.css';

import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const UnorderedList: FC<IProp> = ({ children }) => {
  return <ul className={ulList}>{children}</ul>;
};
