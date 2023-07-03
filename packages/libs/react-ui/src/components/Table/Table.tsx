import { tableClass } from './Table.css';
import { TBody } from './TBody';
import { THead } from './THead';
import { CompoundType } from './types';

import React, { FC } from 'react';

export interface ITableProps {
  children?: CompoundType<typeof TBody> | CompoundType<typeof THead>;
}

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <table className={tableClass}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== TBody && child.type !== THead)
        )
          return null;

        return child;
      })}
    </table>
  );
};
