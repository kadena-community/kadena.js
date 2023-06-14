import { trClass } from './Table.css';
import { Td } from './Td';
import { THead } from './THead';

import React, { FC } from 'react';

export interface ITrProps {
  children?: React.ReactNode;
}

export interface ITrComp extends FC<ITrProps> {
  Td: typeof Td;
  Th: typeof THead;
}
// eslint-disable-next-line react/prop-types
export const Tr: ITrComp = ({ children }) => {
  return (
    <tr className={trClass}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== THead && child.type !== Td)
        )
          return null;

        return child;
      })}
      {children}
    </tr>
  );
};

Tr.Th = THead;
Tr.Td = Td;
