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
import { selectorCell, tableDataCell } from './Table.css';

interface ITableSelectAllCellProps<T> {
  column: GridNode<T>;
  state: ITableRowProps<T>['state'];
}

export function TableSelectAllCell<T>({
  column,
  state,
}: ITableSelectAllCellProps<T>) {
  let ref = useRef<HTMLTableCellElement | null>(null);
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  let { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <th
      {...columnHeaderProps}
      ref={ref}
      className={classNames(selectorCell.header, tableDataCell)}
    >
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox
          {...(checkboxProps as ICheckboxProps)}
          inverse={checkboxProps.isSelected}
        />
      )}
    </th>
  );
}
