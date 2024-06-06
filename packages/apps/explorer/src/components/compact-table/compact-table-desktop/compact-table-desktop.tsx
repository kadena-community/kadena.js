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
import type { ICompactTableProps } from '../compact-table';

import FieldCell from './field-cell';
import { tableClass } from './styles.css';

const CompactTableDesktop: FC<ICompactTableProps> = ({
  data,
  fields,
  label,
}) => {
  console.log(data);
  return (
    <Table aria-label={label} isStriped className={tableClass}>
      <TableHeader>
        {fields.map((field) => (
          <Column key={field.key} width={field.width}>
            {field.label}
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((item, idx) => (
          <Row key={idx}>
            {fields.map((field) => (
              <Cell key={field.key}>
                <FieldCell field={field} item={item} />
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default CompactTableDesktop;
