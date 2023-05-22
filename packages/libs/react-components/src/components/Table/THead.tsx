import { Tr } from './Tr';
import { CompoundType } from './types';

import React, { FC } from 'react';

export interface ITHead {
  children?: CompoundType<typeof Tr>;
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
