import React, { FC } from 'react';

export interface ITBody {
  children?: React.ReactNode;
}

export const TBody: FC<ITBody> = ({ children }) => {
  return <tbody>{children}</tbody>;
};
