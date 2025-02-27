import type { GridNode } from '@react-types/grid';
import classNames from 'classnames';
import React, { useRef } from 'react';
import {
  useTableColumnHeader,
  useTableSelectAllCheckbox,
  VisuallyHidden,
} from 'react-aria';
import type { ICheckboxProps } from '../Form';
import { Checkbox } from '../Form';
import type { ITableRowProps } from './Body';
import type { ITableProps } from './Table';
import { selectorCell, tableDataCell } from './Table.css';

interface ITableSelectAllCellProps<T> {
  column: GridNode<T>;
  state: ITableRowProps<T>['state'];
  inverse?: boolean;
  variant: ITableProps<HTMLTableElement>['variant'];
}

export function TableSelectAllCell<T>({
  column,
  state,
  inverse = false,
  variant,
}: ITableSelectAllCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <th
      {...columnHeaderProps}
      ref={ref}
      className={classNames(selectorCell.header, tableDataCell({ variant }))}
    >
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox
          {...(checkboxProps as ICheckboxProps)}
          inverse={inverse || checkboxProps.isSelected}
        />
      )}
    </th>
  );
}
