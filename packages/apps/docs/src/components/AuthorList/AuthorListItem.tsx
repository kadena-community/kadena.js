import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listItemClass } from './styles.css';

export const AuthorListItem: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listItemClass}>{children}</ul>;
};
