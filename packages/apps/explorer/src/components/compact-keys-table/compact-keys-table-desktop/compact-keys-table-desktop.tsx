import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ICompactKeyTableProps } from '../types';
import { tableClass } from './styles.css';

const CompactTransactionsTableDesktop: FC<ICompactKeyTableProps> = ({
  keys,
}) => {
  return (
    <Table aria-label="Keys table" isStriped className={tableClass}>
      <TableHeader>
        <Column width="10%">ChainId</Column>
        <Column width="60%">Key</Column>
        <Column width="20%">Predicate</Column>
      </TableHeader>
      <TableBody>
        {keys.map((key) => (
          <Row key={key.key + key.chainId}>
            <Cell>
              <span>{key.chainId}</span>
            </Cell>
            <Cell>
              <span>{key.key}</span>
            </Cell>
            <Cell>
              <span>{key.predicate}</span>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
export default CompactTransactionsTableDesktop;
