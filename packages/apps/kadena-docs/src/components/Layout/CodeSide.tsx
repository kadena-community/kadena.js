import { ILayout } from '@/types/Layout';
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
