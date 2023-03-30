import React, { FC, ReactNode } from 'react';
import { Main } from './Main';

type IProps = {
  children?: ReactNode;
};

export const Landing: FC<IProps> = ({ children }) => {
  return (
    <Main>
      <h1>Landing</h1>
      {children}
    </Main>
  );
};
