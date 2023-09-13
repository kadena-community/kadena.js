import { cardSectionClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const LandingPageCardSection: FC<PropsWithChildren> = ({ children }) => {
  return <div className={cardSectionClass}>{children}</div>;
};
