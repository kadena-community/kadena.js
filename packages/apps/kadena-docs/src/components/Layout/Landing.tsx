import { Content } from './components/Main/styles';
import { ILayout } from './types';

import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Content>
      <h1>Landing</h1>
      {children}
    </Content>
  );
};

Landing.displayName = 'Landing';
