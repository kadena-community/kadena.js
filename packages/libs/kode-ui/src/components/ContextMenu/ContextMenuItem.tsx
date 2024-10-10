import type { FC, MouseEventHandler, ReactElement } from 'react';
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
  'aria-label'
> & {
  label: string;
  isDisabled?: boolean;
  endVisual?: ReactElement;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const ContextMenuItem: FC<IContextMenuItemProps> = ({
  label,
  isDisabled = false,
  endVisual,
  onClick,
  ...props
}) => {
  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (onClick && !isDisabled) onClick(e);
  };
  return (
    <Stack
      as="button"
      alignItems="center"
      data-disabled={isDisabled}
      className={menuItemClass}
      onClick={handleClick}
      {...props}
    >
      <Text transform="capitalize" className={menuItemLabelClass}>
        {label}
      </Text>
      <Stack className={menuItemIconClass}>{endVisual ?? endVisual}</Stack>
    </Stack>
  );
};
