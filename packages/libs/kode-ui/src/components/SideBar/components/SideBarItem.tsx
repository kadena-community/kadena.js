import type { FC } from 'react';
import React from 'react';
import { Text } from './../../Typography';

export interface ISideBarItem {
  label: string;
  isExpanded?: boolean;
}

export const SideBarItem: FC<ISideBarItem> = ({
  label,
  isExpanded = false,
}) => {
  return (
    <li>
      <Text>
        {label} {isExpanded.toString()}
      </Text>
    </li>
  );
};
