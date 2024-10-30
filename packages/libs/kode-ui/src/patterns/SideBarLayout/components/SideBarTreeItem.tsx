import type { FC } from 'react';
import React from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { breakpoints } from './../../../styles';
import { useSideBar } from './SideBarProvider';

export interface ISideBarTreeItemProps {
  label: string;
  onPress: (e: PressEvent) => void;
}
export const SideBarTreeItem: FC<ISideBarTreeItemProps> = ({
  label,
  onPress,
}) => {
  const { handleSetExpanded } = useSideBar();
  const isMediumDevice = useMedia(breakpoints.md, true);
  const handlePress = (e: PressEvent) => {
    if (!isMediumDevice) handleSetExpanded(false);
    onPress(e);
  };
  return (
    <li className={listItemClass}>
      <Button variant="transparent" isCompact onPress={handlePress}>
        {label}
      </Button>
    </li>
  );
};
