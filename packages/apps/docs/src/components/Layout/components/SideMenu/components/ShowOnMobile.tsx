import { showOnMobileClass } from './styles.css';

import React, { type FC, type PropsWithChildren } from 'react';

export const ShowOnMobile: FC<PropsWithChildren> = ({ children }) => (
  <div className={showOnMobileClass}>{children}</div>
);
