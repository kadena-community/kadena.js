import { TableState, TreeGridState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import {
  mergeProps,
  useFocusRing,
  useTableColumnHeader,
  useTableHeaderRow,
} from 'react-aria';

interface ITableHeaderRowProps<T> {
  item: GridNode<T>;
  state: TableState<T>;
  children: ReactNode;
}

export function TableHeaderRow({
  item,
  state,
  children,
}: ITableHeaderRowProps<object>) {
  const ref = useRef(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
}

interface ITableColumnHeaderProps<T> {
  column: GridNode<T>;
  state: TableState<T>;
}

export function TableColumnHeader({
  column,
  state,
}: ITableColumnHeaderProps<object>) {
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: column.colspan && column.colspan > 1 ? 'center' : 'left',
        padding: '5px 10px',
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default',
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <span
          aria-hidden="true"
          style={{
            padding: '0 2px',
            visibility:
              state.sortDescriptor?.column === column.key
                ? 'visible'
                : 'hidden',
          }}
        >
          {arrowIcon}
        </span>
      )}
    </th>
  );
}
