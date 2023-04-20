import { Content } from './components';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return <Content id="maincontent">{children}</Content>;
};

Landing.displayName = 'Landing';
