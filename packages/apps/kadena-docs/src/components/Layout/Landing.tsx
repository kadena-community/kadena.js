import { Content } from './components';
import { ILayout } from './types';

import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Content id="maincontent">
      <h1>Landing</h1>
      {children}
    </Content>
  );
};

Landing.displayName = 'Landing';
