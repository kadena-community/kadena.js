import type { TableState } from '@react-stately/table';
import type { GridNode } from '@react-types/grid';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import {
  mergeProps,
  useFocusRing,
  useTableColumnHeader,
  useTableHeaderRow,
} from 'react-aria';
import { Stack } from '..';
import { ChevronDown, ChevronUp } from '../Icon/System/SystemIcon';
import { columnHeader, headerRow } from './Table.css';

interface ITableHeaderRowProps<T> {
  item: GridNode<T>;
  state: TableState<T>;
  children: ReactNode;
}

export function TableHeaderRow<T extends object>({
  item,
  state,
  children,
}: ITableHeaderRowProps<T>) {
  const ref = useRef(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr className={headerRow} {...rowProps} ref={ref}>
      {children}
    </tr>
  );
}

/*
 * This is a utility function for the width style while the column resizing is not implemented
 * https://react-spectrum.adobe.com/react-aria/useTable.html#resizable-columns
 */
const reg = /^\d+$/;
function getWidthStyle(width: string | number) {
  if (typeof width === 'number' || reg.test(width)) {
    return `${width}px`;
  }
  return width;
}

interface ITableColumnHeaderProps<T> {
  column: GridNode<T>;
  state: TableState<T>;
}

export function TableColumnHeader<T extends object>({
  column,
  state,
}: ITableColumnHeaderProps<T>) {
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const ArrowIcon =
    state.sortDescriptor?.direction === 'ascending' ? ChevronUp : ChevronDown;

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      className={columnHeader}
      style={{
        width: getWidthStyle(column.props.width),
        minWidth: getWidthStyle(column.props.minWidth),
        maxWidth: getWidthStyle(column.props.maxWidth),
      }}
      ref={ref}
      data-focused={isFocusVisible || undefined}
      data-multi-column={column.colspan && column.colspan > 1}
      data-sortable={column.props.allowsSorting || undefined}
    >
      <Stack flexDirection="row" gap="xs" alignItems="center">
        {column.rendered}
        {column.props.allowsSorting && (
          <ArrowIcon
            aria-hidden
            style={{
              visibility:
                state.sortDescriptor?.column === column.key
                  ? 'visible'
                  : 'hidden',
            }}
          />
        )}
      </Stack>
    </th>
  );
}
