import {
  Cell,
  Column,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import type { ICompactTableProps } from '../compact-table';

import FieldCell from './field-cell';
import { tableBorderClass, tableClass } from './styles.css';

const CompactTableDesktop: FC<ICompactTableProps> = ({
  data,
  fields,
  label = 'Table',
  isLoading = false,
}) => {
  return (
    <Stack
      padding="sm"
      width="100%"
      flexDirection="column"
      gap="sm"
      className={tableBorderClass}
    >
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
                  <FieldCell isLoading={isLoading} field={field} item={item} />
                </Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default CompactTableDesktop;
