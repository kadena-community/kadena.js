import { showOnMobileClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const ShowOnMobile: FC<PropsWithChildren> = ({ children }) => (
  <div className={showOnMobileClass}>{children}</div>
);
