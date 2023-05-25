import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const Notification: FC<IProps> = ({ children, ...props }) => {
  return <div {...props}>sdf{children}</div>;
};
