import { type ITableProps, Table as TableContainer } from './Table';
import { type ITBodyProps, TBody } from './TBody';
import { type ITdProps, Td } from './Td';
import { type IThProps, Th } from './Th';
import { type ITHeadProps, THead } from './THead';
import { type ITrProps, Tr } from './Tr';

import { type FC } from 'react';

export type {
  ITableProps,
  ITBodyProps,
  ITHeadProps,
  ITrProps,
  IThProps,
  ITdProps,
};

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
  Td: Td,
};
