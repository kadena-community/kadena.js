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
import type { ICompactTableProps } from '../CompactTable';

import { alignVariants } from '../styles.css';
import { FieldCell } from './FieldCell';
import { tableBorderClass, tableClass } from './styles.css';

type IProps = Omit<
  ICompactTableProps,
  'pageInfo' | 'setPage' | 'pageSize' | 'totalCount'
>;

export const CompactTableDesktop: FC<IProps> = ({
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
              <Stack
                width="100%"
                className={alignVariants({ align: field.align ?? 'start' })}
              >
                {field.label}
              </Stack>
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
