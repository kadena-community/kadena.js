import React, { FC, ReactNode } from 'react';
import { Header, Footer } from './components';

type IProps = {
  children?: ReactNode;
};

export const Main: FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
