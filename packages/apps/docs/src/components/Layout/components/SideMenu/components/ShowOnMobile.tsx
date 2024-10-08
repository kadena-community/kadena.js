import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { showOnMobileClass } from './styles.css';

export const ShowOnMobile: FC<PropsWithChildren> = ({ children }) => (
  <div className={showOnMobileClass}>{children}</div>
);
