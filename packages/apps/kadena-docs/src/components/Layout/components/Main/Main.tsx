import { Footer, Header } from '..';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Main: FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
