import { Main } from './components/Main';
import { ILayout } from './types';

import React, { FC } from 'react';

export const Full: FC<ILayout> = ({ children }) => {
  return (
    <Main>
      <h1>Full</h1>
      {children}
    </Main>
  );
};

Full.displayName = 'Full';
