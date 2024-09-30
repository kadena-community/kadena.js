import type { FC, ReactElement } from 'react';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';
import { Stack, Text } from '../';
import {
  menuItemClass,
  menuItemIconClass,
  menuItemLabelClass,
} from './style.css';

export type IContextMenuItemProps = Pick<
  AriaButtonProps<'button'>,
  'aria-label' | 'onPress'
> & {
  label: string;
  isDisabled?: boolean;
  endVisual?: ReactElement;
};

export const ContextMenuItem: FC<IContextMenuItemProps> = ({
  label,
  isDisabled = false,
  endVisual,
  ...props
}) => {
  return (
    <Stack
      alignItems="center"
      data-disabled={isDisabled}
      className={menuItemClass}
      {...props}
    >
      <Text transform="capitalize" className={menuItemLabelClass}>
        {label}
      </Text>
      <Stack className={menuItemIconClass}>{endVisual ?? endVisual}</Stack>
    </Stack>
  );
};
