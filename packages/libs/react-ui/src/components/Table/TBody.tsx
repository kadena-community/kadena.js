import { Tr } from './Tr';

import React, { FC } from 'react';

export interface ITBody {
  children?: React.ReactNode;
}

export const TBody: FC<ITBody> = ({ children }) => {
  return (
    <tbody>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr)
        )
          return null;

        return child;
      })}
    </tbody>
  );
};
