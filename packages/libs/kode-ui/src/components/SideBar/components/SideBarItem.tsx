import type { FC } from 'react';
import React from 'react';
import { Text } from 'src/components/Typography';

export interface ISideBarItem {
  label: string;
}

export const SideBarItem: FC<ISideBarItem> = ({ label }) => {
  return (
    <li>
      <Text>{label}</Text>
    </li>
  );
};
