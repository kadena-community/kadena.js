import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Pre: FC<IProp> = ({ children }) => {
  return <>{children}</>;
};
