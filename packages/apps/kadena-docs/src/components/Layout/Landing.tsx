import { Main } from './components';
import { ILayout } from './types';

import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <Main>
      <h1>Landing</h1>
      {children}
    </Main>
  );
};

Landing.displayName = 'Landing';
