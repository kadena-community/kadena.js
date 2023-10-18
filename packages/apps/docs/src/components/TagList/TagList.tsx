import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass } from './styles.css';

export const TagList: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listClass}>{children}</ul>;
};
