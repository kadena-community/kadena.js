import React, { FC } from 'react';

export interface ITHead {
  children?: React.ReactNode;
}

export const THead: FC<ITHead> = ({ children }) => {
  return <thead>{children}</thead>;
};
