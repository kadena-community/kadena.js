import type { FC } from 'react';
import React from 'react';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';

export interface ISideBarTreeItemProps {
  label: string;
  onPress: (e: PressEvent) => void;
}
export const SideBarTreeItem: FC<ISideBarTreeItemProps> = ({
  label,
  onPress,
}) => {
  return (
    <li className={listItemClass}>
      <Button variant="transparent" isCompact onPress={onPress}>
        {label}
      </Button>
    </li>
  );
};
