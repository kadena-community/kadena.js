import React, { FC } from 'react';

export interface ISection {
  children?: string;
}

export const Section: FC<ISection> = ({ children }) => {
  return <li>{children}</li>;
};
