import { StyledTable } from './styles';
import { TBody } from './TBody';
import { THead } from './THead';
import { Tr } from './Tr';
import type { CompoundType } from './types';

import type { FC } from 'react';
import React from 'react';

export interface ITable {
  children?: CompoundType<typeof TBody> | CompoundType<typeof THead>;
}
interface ITableComposition extends FC<ITable> {
  Body: typeof TBody;
  Head: typeof THead;
  Tr: typeof Tr;
}

// eslint-disable-next-line react/prop-types
export const Table: ITableComposition = ({ children }) => {
  return (
    <StyledTable>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== TBody && child.type !== THead)
        )
          return null;

        return child;
      })}
    </StyledTable>
  );
};

Table.Body = TBody;
Table.Head = THead;
Table.Tr = Tr;
