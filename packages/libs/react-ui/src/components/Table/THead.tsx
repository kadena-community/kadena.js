import { Tr } from './Tr';
import type { CompoundType } from './types';

import type { FC } from 'react';
import React from 'react';

export interface ITHeadProps {
  children?: CompoundType<typeof Tr>;
}

export const THead: FC<ITHeadProps> = ({ children }) => {
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
