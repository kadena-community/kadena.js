import { Tr } from './Tr';
import type { CompoundType } from './types';

import type { FC } from 'react';
import React from 'react';

export interface ITBodyProps {
  children?: CompoundType<typeof Tr> | (() => React.ReactNode[]);
}

export const TBody: FC<ITBodyProps> = ({ children }) => {
  return (
    <tbody>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr && child.type !== React.Fragment)
        ) {
          return null;
        }

        return child;
      })}
    </tbody>
  );
};
