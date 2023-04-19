import { ILayout } from './types';

import React, { FC } from 'react';

export const CodeSide: FC<ILayout> = ({ children }) => {
  return (
    <>
      <h1>Codeside</h1>
      {children}
    </>
  );
};

CodeSide.displayName = 'CodeSide';
