import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  Text,
} from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ICompactKeyTableProps } from '../types';
import { dataFieldClass } from './styles.css';

const CompactTransactionsTableDesktop: FC<ICompactKeyTableProps> = ({
  keys,
}) => {
  return (
    <Table aria-label="Keys table" isStriped>
      <TableHeader>
        <Column width="20%">ChainId</Column>
        <Column width="50%">Key</Column>
        <Column width="30%">Predicate</Column>
      </TableHeader>
      <TableBody>
        {keys.map((key, index) => (
          <Row key={key.key}>
            <Cell>{key.chainId}</Cell>
            <Cell>
              <Text className={dataFieldClass}>{key.key}</Text>
            </Cell>
            <Cell>{key.predicate}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
export default CompactTransactionsTableDesktop;
