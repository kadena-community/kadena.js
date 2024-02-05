import type { FC } from 'react';
import React from 'react';
import { Tr } from './Tr';
import type { CompoundType } from './types';

export interface ITHeadProps {
  children?: CompoundType<typeof Tr>;
  className?: string;
}

export const THead: FC<ITHeadProps> = ({ children, className }) => {
  return (
    <thead className={className}>
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
