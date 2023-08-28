import { showOnMobileClass } from './styles.css';

import React, { FC, PropsWithChildren } from 'react';

export const ShowOnMobile: FC<PropsWithChildren> = ({ children }) => (
  <div className={showOnMobileClass}>{children}</div>
);
