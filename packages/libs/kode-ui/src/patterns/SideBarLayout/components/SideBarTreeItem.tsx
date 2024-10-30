import type { FC } from 'react';
import React from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import { Link } from './../../../components';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { breakpoints } from './../../../styles';
import { useSideBar } from './SideBarProvider';

export interface ISideBarTreeItemProps {
  label: string;
  onPress?: (e: PressEvent) => void;
  href?: string;
  component?: any;
}
export const SideBarTreeItem: FC<ISideBarTreeItemProps> = ({
  label,
  onPress,
  href,
  component,
}) => {
  const { handleSetExpanded, isActiveUrl } = useSideBar();
  const isMediumDevice = useMedia(breakpoints.md, true);
  const handlePress = (e: PressEvent) => {
    if (!isMediumDevice) handleSetExpanded(false);
    if (onPress) onPress(e);
  };

  const Component = href ? Link : Button;
  return (
    <li className={listItemClass}>
      <Component
        component={component}
        variant="transparent"
        isCompact
        isDisabled={isActiveUrl(href)}
        href={href}
        onPress={handlePress}
      >
        {label}
      </Component>
    </li>
  );
};
