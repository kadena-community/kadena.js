import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { lineErrorClass } from './styles.css';

export const ErrorLine: FC<PropsWithChildren> = ({ children }) => {
  return <pre className={lineErrorClass}>{children}</pre>;
};
