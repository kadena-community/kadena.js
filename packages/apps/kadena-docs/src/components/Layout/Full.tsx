import React, { FC, ReactNode } from 'react';
import { Main } from './Main';

type IProps = {
  children?: ReactNode;
};

export const Full: FC<IProps> = ({ children }) => {
  return (
    <Main>
      <h1>Full</h1>
      {children}
    </Main>
  );
};
