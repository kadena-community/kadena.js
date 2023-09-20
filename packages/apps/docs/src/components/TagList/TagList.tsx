import { listClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const TagList: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listClass}>{children}</ul>;
};
