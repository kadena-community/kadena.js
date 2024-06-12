import type { TableProps } from '@react-types/table';
import type { ComponentProps } from 'react';
import React, { useRef } from 'react';
import type { AriaTableProps } from 'react-aria';
import { useTable, useTableRowGroup } from 'react-aria';
import { useTableState } from 'react-stately';
import { table, tableWrapper } from './Table.css';

import classNames from 'classnames';
import { TableCell, TableRow } from './Body';
import { TableColumnHeader, TableHeaderRow } from './Header';
import { TableSelectAllCell } from './TableSelectAllCell';
import { TableSelectionCell } from './TableSelectionCell';

export interface ITableProps<T>
  extends AriaTableProps<T>,
    TableProps<T>,
    Omit<ComponentProps<'table'>, 'children'> {
  isStriped?: boolean;
  isCompact?: boolean;
}

export function Table<T extends object>(props: ITableProps<T>) {
  const scrollRef = useRef(null);

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      props.selectionMode === 'multiple' || props.selectionMode === 'single',
  });

  const ref = useRef(null);
  const { collection } = state;
  const { gridProps } = useTable({ ...props, scrollRef }, state, ref);

  return (
    <div className={tableWrapper} ref={scrollRef}>
      <table
        {...gridProps}
        className={classNames(table, props.className, {
          striped: props.isStriped,
          compact: props.isCompact,
        })}
        ref={ref}
      >
        <TableRowGroup type="thead">
          {collection.headerRows.map((headerRow) => (
            <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
              {[...headerRow.childNodes].map((column) =>
                column.props.isSelectionCell ? (
                  <TableSelectAllCell
                    key={column.key}
                    column={column}
                    state={state}
                  />
                ) : (
                  <TableColumnHeader
                    key={column.key}
                    column={column}
                    state={state}
                  />
                ),
              )}
            </TableHeaderRow>
          ))}
        </TableRowGroup>
        <TableRowGroup type="tbody">
          {[...collection.body.childNodes].map((row) => (
            <TableRow
              key={row.key}
              item={row}
              state={state}
              selectionMode={props.selectionMode}
            >
              {[...row.childNodes].map((cell) =>
                cell.props.isSelectionCell ? (
                  <TableSelectionCell
                    key={cell.key}
                    cell={cell}
                    state={state}
                    selectionMode={props.selectionMode}
                  />
                ) : (
                  <TableCell key={cell.key} cell={cell} state={state} />
                ),
              )}
            </TableRow>
          ))}
        </TableRowGroup>
      </table>
    </div>
  );
}

export interface ITableRowGroupProps {
  type: 'thead' | 'tbody';
  children?: React.ReactNode;
}

export function TableRowGroup({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type: Element,
  children,
}: ITableRowGroupProps) {
  const { rowGroupProps } = useTableRowGroup();
  return <Element {...rowGroupProps}>{children}</Element>;
}
