import { Content } from '../components';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Code: FC<ILayout> = ({ children }) => {
  return <Content id="maincontent">{children}</Content>;
};

Code.displayName = 'CodeSide';
