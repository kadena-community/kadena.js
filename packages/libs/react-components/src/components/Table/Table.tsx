import { StyledTable } from './styles';
import { ITBody, TBody } from './TBody';
import { ITHead, THead } from './THead';
import { Tr } from './Tr';

import React, { FC, FunctionComponentElement } from 'react';

export interface ITable {
  children?:
    | FunctionComponentElement<ITBody>
    | FunctionComponentElement<ITBody>[]
    | FunctionComponentElement<ITHead>
    | FunctionComponentElement<ITHead>[];
}
interface ITableComposition extends FC<ITable> {
  TBody: typeof TBody;
  THead: typeof THead;
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

Table.TBody = TBody;
Table.THead = THead;
Table.Tr = Tr;
