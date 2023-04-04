import { Main } from './components';
import { ILayout } from './types';

import React, { FC } from 'react';

export const CodeSide: FC<ILayout> = ({ children }) => {
  return (
    <Main>
      <h1>Codeside</h1>
      {children}
    </Main>
  );
};

CodeSide.displayName = 'CodeSide';
