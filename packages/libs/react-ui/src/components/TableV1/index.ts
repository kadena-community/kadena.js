import type { FC } from 'react';
import type { ITBodyProps } from './TBody';
import { TBody } from './TBody';
import type { ITHeadProps } from './THead';
import { THead } from './THead';
import type { ITableProps } from './Table';
import { Table as TableContainer } from './Table';
import type { ITdProps } from './Td';
import { Td } from './Td';
import type { IThProps } from './Th';
import { Th } from './Th';
import type { ITrProps } from './Tr';
import { Tr } from './Tr';

export type {
  ITBodyProps,
  ITHeadProps,
  ITableProps,
  ITdProps,
  IThProps,
  ITrProps,
};

interface ITable {
  Root: FC<ITableProps>;
  Body: FC<ITBodyProps>;
  Head: FC<ITHeadProps>;
  Tr: FC<ITrProps>;
  Th: FC<IThProps>;
  Td: FC<ITdProps>;
}

/**
 * @deprecated Use Table instead
 */
export const TableV1: ITable = {
  Root: TableContainer,
  Body: TBody,
  Head: THead,
  Tr: Tr,
  Th: Th,
  Td: Td,
};
