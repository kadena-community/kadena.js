import { listItemClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const AuthorListItem: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listItemClass}>{children}</ul>;
};
