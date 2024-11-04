import type { FC } from 'react';
import React from 'react';
import { Stack, Text } from '../';
import { menuDividerClass, menuDividerTextClass } from './style.css';

export interface IContextMenuDividerProps {
  label?: string;
}

export const ContextMenuDivider: FC<IContextMenuDividerProps> = ({ label }) => {
  return (
    <Stack alignItems="center" marginInline="md" flexDirection="row" gap="sm">
      {label && (
        <Text as="span" transform="capitalize" className={menuDividerTextClass}>
          {label}
        </Text>
      )}
      <Stack className={menuDividerClass}></Stack>
    </Stack>
  );
};
