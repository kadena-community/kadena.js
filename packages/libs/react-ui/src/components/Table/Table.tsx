import { tableClass } from './Table.css';
import { TBody } from './TBody';
import { THead } from './THead';
import { Tr } from './Tr';

import React, { FC } from 'react';

export interface ITable {
  children?: React.ReactNode;
}
interface ITableComposition extends FC<ITable> {
  Body: typeof TBody;
  Head: typeof THead;
  Tr: typeof Tr;
}

// eslint-disable-next-line react/prop-types
export const Table: ITableComposition = ({ children }) => {
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

Table.Body = TBody;
Table.Head = THead;
Table.Tr = Tr;
