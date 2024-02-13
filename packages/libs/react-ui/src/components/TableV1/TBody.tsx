import type { FC } from 'react';
import React from 'react';
import { Tr } from './Tr';
import type { CompoundType } from './types';

export interface ITBodyProps {
  children?: CompoundType<typeof Tr>;
  className?: string;
}

export const TBody: FC<ITBodyProps> = ({ children, className }) => {
  return (
    <tbody className={className}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Tr)
        ) {
          return null;
        }

        return child;
      })}
    </tbody>
  );
};
