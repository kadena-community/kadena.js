import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  return <code {...props}>{children}</code>;
};
