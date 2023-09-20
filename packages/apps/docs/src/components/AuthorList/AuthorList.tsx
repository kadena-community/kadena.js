import { listClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const AuthorList: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listClass}>{children}</ul>;
};
