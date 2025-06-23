import type { FC } from 'react';
import React from 'react';
import type { ICompactTableProps } from '../CompactTable';
import { alignVariants } from '../styles.css';
import {
  Cell,
  Column,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from './../../../components';
import { FieldCell } from './../FieldCell';
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
  variant = 'default',
  ...props
}) => {
  return (
    <Stack
      width="100%"
      flexDirection="column"
      gap="sm"
      className={tableBorderClass({ variant })}
      {...props}
    >
      <Table
        aria-label={label}
        isStriped
        className={tableClass}
        variant={variant}
      >
        <TableHeader>
          {fields.map((field, idx) => (
            <Column key={`${field.key?.toString()}${idx}`} width={field.width}>
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
            <Row key={`${item.toString()}${idx}`}>
              {fields.map((field, innerIdx) => (
                <Cell key={`${field.key?.toString()}${innerIdx}`}>
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
