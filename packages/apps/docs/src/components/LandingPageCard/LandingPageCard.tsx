import { cardClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const LandingPageCard: FC<PropsWithChildren> = ({ children }) => {
  return <section className={cardClass}>{children}</section>;
};
