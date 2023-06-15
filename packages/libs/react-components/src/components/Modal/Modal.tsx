import React, { FC, ReactNode } from 'react';

export interface IModalProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'as' | 'disabled' | 'children' | 'className'
  > {
  children?: ReactNode;
}

export const Modal: FC<IModalProps> = ({ children }) => {
  return <section>{children}</section>;
};
