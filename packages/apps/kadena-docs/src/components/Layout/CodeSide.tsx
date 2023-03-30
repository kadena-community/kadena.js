import React, { FC, ReactNode } from 'react';
import { Main } from './Main';

type IProps = {
  children?: ReactNode;
};

export const CodeSide: FC<IProps> = ({ children }) => {
  return (
    <Main>
      <h1>Codeside</h1>
      {children}
    </Main>
  );
};
