import type { TableState, TreeGridState } from '@react-stately/table';
import type { GridNode } from '@react-types/grid';
import type { TableProps } from '@react-types/table';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import {
  mergeProps,
  useFocusRing,
  useHover,
  useTableCell,
  useTableRow,
} from 'react-aria';
import { tableDataCell, tableRow } from './Table.css';

export interface ITableRowProps<T> {
  item: GridNode<T>;
  state: TableState<T> | TreeGridState<T>;
  children: ReactNode;
  selectionMode: TableProps<T>['selectionMode'];
}

export function TableRow<T extends object>({
  item,
  children,
  state,
}: ITableRowProps<T>) {
  const ref = useRef(null);
  const { rowProps, isSelected } = useTableRow(
    {
      node: item,
    },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled: false });

  return (
    <tr
      className={tableRow}
      {...mergeProps(rowProps, focusProps, hoverProps)}
      data-focused={isFocusVisible || undefined}
      data-hovered={isHovered || undefined}
      data-selected={isSelected || undefined}
      ref={ref}
    >
      {children}
    </tr>
  );
}

interface ITableCellProps<T> {
  cell: GridNode<T>;
  state: TableState<T>;
}

export function TableCell<T extends object>({
  cell,
  state,
}: ITableCellProps<T>) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      className={tableDataCell}
      data-focused={isFocusVisible || undefined}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
}
