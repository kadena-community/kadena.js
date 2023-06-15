import { thClass } from './Table.css';
import { Tr } from './Tr';

import React, { FC } from 'react';

export interface ITHead {
  children?: React.ReactNode;
}

export const THead: FC<ITHead> = ({ children }) => {
  return (
    <thead>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr)
        )
          return null;

        return child;
      })}
    </thead>
  );
};
