import { ITableProps, Table as TableContainer } from './Table';
import { ITBodyProps, TBody } from './TBody';
import { ITdProps, Td } from './Td';
import { IThProps, Th } from './Th';
import { ITHeadProps, THead } from './THead';
import { ITrProps, Tr } from './Tr';

import { FC } from 'react';

export { ITableProps, ITBodyProps, ITHeadProps, ITrProps, IThProps, ITdProps };

interface ITable {
  Root: FC<ITableProps>;
  Body: FC<ITBodyProps>;
  Head: FC<ITHeadProps>;
  Tr: FC<ITrProps>;
  Th: FC<IThProps>;
  Td: FC<ITdProps>;
}

export const Table: ITable = {
  Root: TableContainer,
  Body: TBody,
  Head: THead,
  Tr: Tr,
  Th: Th,
  Td: Td
}
