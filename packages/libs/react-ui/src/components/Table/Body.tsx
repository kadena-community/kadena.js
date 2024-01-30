import type {
  TableColumnResizeState,
  TableState,
  TreeGridState,
} from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import {
  mergeProps,
  useFocusRing,
  useTableCell,
  useTableRow,
} from 'react-aria';

interface ITableRowProps<T> {
  item: GridNode<T>;
  state: TableState<T> | TreeGridState<T>;
  children: ReactNode;
}

export function TableRow({ item, children, state }: ITableRowProps<object>) {
  const ref = useRef(null);
  const isSelected = state.selectionManager.isSelected(item.key);
  const { rowProps, isPressed } = useTableRow(
    {
      node: item,
    },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <tr
      style={{
        background: isSelected
          ? 'blueviolet'
          : isPressed
          ? 'var(--spectrum-global-color-gray-400)'
          : item.index && item.index % 2
          ? 'var(--spectrum-alias-highlight-hover)'
          : 'none',
        color: isSelected ? 'white' : undefined,
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default',
      }}
      {...mergeProps(rowProps, focusProps)}
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

export function TableCell({ cell, state }: ITableCellProps<object>) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      style={{
        padding: '5px 10px',
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
      }}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
}
