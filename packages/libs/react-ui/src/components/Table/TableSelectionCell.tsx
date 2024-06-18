import React, { useRef } from 'react';
import { useTableCell, useTableSelectionCheckbox } from 'react-aria';

import type { GridNode } from '@react-types/grid';
import classNames from 'classnames';
import type { ICheckboxProps } from '../Form';
import { Checkbox } from '../Form';
import { boxClass, iconClass } from '../Form/RadioGroup/Radio.css';
import { RadioGroup } from '../Form/RadioGroup/RadioGroup';
import type { ITableRowProps } from './Body';
import { selectorCell, tableDataCell } from './Table.css';

interface ITableSelectionCell<T> {
  cell: GridNode<T>;
  state: ITableRowProps<T>['state'];
  selectionMode?: 'single' | 'multiple' | 'none';
}

const Dot = ({ className }: { className: string }) => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="4" cy="4" r="4" />
  </svg>
);

function Radio({ isSelected }: { isSelected?: boolean }) {
  return (
    <span className={boxClass} data-selected={isSelected} aria-hidden>
      <Dot className={iconClass} />
    </span>
  );
}

export function TableSelectionCell<T>({
  cell,
  state,
  selectionMode,
}: ITableSelectionCell<T>) {
  let ref = useRef<HTMLTableCellElement | null>(null);
  let { gridCellProps } = useTableCell({ node: cell }, state, ref);
  let { checkboxProps } = useTableSelectionCheckbox(
    { key: cell?.parentKey || '' },
    state,
  );

  return (
    <td
      {...gridCellProps}
      ref={ref}
      className={classNames(selectorCell.body, tableDataCell)}
    >
      {selectionMode === 'multiple' ? (
        <Checkbox
          {...(checkboxProps as ICheckboxProps)}
          inverse={checkboxProps.isSelected}
        />
      ) : (
        <RadioGroup direction="row">
          <Radio isSelected={checkboxProps.isSelected} />
        </RadioGroup>
      )}
    </td>
  );
}
