import { Tr } from './Tr';
import { type CompoundType } from './types';

import React, { type FC } from 'react';

export interface ITBodyProps {
  children?: CompoundType<typeof Tr>;
}

export const TBody: FC<ITBodyProps> = ({ children }) => {
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
