import type { FC, ReactElement } from 'react';
import React from 'react';
import { Stack, Text } from '../';
import {
  menuItemClass,
  menuItemIconClass,
  menuItemLabelClass,
} from './style.css';

export interface IContextMenuUtemProps {
  label: string;
  isDisabled?: boolean;
  endVisual?: ReactElement;
}

export const ContextMenuItem: FC<IContextMenuUtemProps> = ({
  label,
  isDisabled = false,
  endVisual,
}) => {
  return (
    <Stack
      alignItems="center"
      data-disabled={isDisabled}
      className={menuItemClass}
    >
      <Text transform="capitalize" className={menuItemLabelClass}>
        {label}
      </Text>
      <Stack className={menuItemIconClass}>{endVisual ?? endVisual}</Stack>
    </Stack>
  );
};
