import type { TableProps } from '@react-types/table';
import type { ComponentProps } from 'react';
import React, { useRef } from 'react';
import type { AriaTableProps } from 'react-aria';
import { useTable, useTableRowGroup } from 'react-aria';
import { useTableState } from 'react-stately';

import { TableCell, TableRow } from './Body';
import { TableColumnHeader, TableHeaderRow } from './Header';

export interface ITableProps
  extends AriaTableProps<object>,
    TableProps<object> {
  className?: string;
  style?: ComponentProps<'table'>['style'];
}

export function Table(props: ITableProps) {
  const state = useTableState({
    ...props,
  });

  const ref = useRef(null);
  const { collection } = state;
  const { gridProps } = useTable(props, state, ref);

  return (
    <table {...gridProps} ref={ref} style={{ borderCollapse: 'collapse' }}>
      <TableRowGroup type="thead">
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) => (
              // column.props.isSelectionCell ? (
              //   <TableSelectAllCell
              //     key={column.key}
              //     column={column}
              //     state={state}
              //   />
              // ) : (
              //   <TableColumnHeader
              //     key={column.key}
              //     column={column}
              //     state={state}
              //   />
              // ),
              <TableColumnHeader
                key={column.key}
                column={column}
                state={state}
              />
            ))}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type="tbody">
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) => (
              // cell.props.isSelectionCell ? (
              //   <TableCheckboxCell key={cell.key} cell={cell} state={state} />
              // ) : (
              //   <TableCell key={cell.key} cell={cell} state={state} />
              // ),
              <TableCell key={cell.key} cell={cell} state={state} />
            ))}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
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
  return (
    <Element
      {...rowGroupProps}
      //   style={
      //     Element === 'thead'
      //       ? { borderBottom: '2px solid var(--spectrum-global-color-gray-800)' }
      //       : null
      //   }
    >
      {children}
    </Element>
  );
}
