import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { lineSuccessClass } from './styles.css';

export const SuccessLine: FC<PropsWithChildren> = ({ children }) => {
  return (
    <pre className={lineSuccessClass}>{JSON.stringify(children, null, 2)}</pre>
  );
};
