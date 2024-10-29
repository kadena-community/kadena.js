import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { listItemClass } from '../sidebar.css';
import { Button } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { useSideBar } from './SideBarProvider';

export interface ISideBarItemProps extends PropsWithChildren {
  visual?: ReactElement;
}

export const SideBarItem: FC<ISideBarItemProps> = ({ visual, children }) => {
  const { isExpanded } = useSideBar();

  return (
    <li className={listItemClass}>
      <Media lessThan="md">{children}</Media>
      <Media greaterThanOrEqual="md">
        {!isExpanded ? (
          <Button variant="transparent" startVisual={visual} />
        ) : (
          children
        )}
      </Media>
    </li>
  );
};
