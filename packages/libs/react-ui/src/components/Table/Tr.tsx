import { trClass } from './Table.css';
import { Td } from './Td';
import { Th } from './Th';

import React, { FC } from 'react';

export interface ITrProps {
  children?: React.ReactNode;
}

export interface ITrComp extends FC<ITrProps> {
  Td: typeof Td;
  Th: typeof Th;
}
// eslint-disable-next-line react/prop-types
export const Tr: ITrComp = ({ children }) => {
  return (
    <tr className={trClass}>
      {React.Children.map(children, (child) => {
        console.log('child', child);
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Th && child.type !== Td)
        )
          return null;

        return child;
      })}
      {children}
    </tr>
  );
};

Tr.Th = Th;
Tr.Td = Td;
