import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Main: FC<IProps> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};
