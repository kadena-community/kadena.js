import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { useSideBar } from '../SideBarProvider';
import { listItemClass } from '../style.css';
import { Button } from './../../Button';

export interface ISideBarItem extends PropsWithChildren {
  visual?: ReactElement;
}

export const SideBarItem: FC<ISideBarItem> = ({ visual, children }) => {
  const { isExpanded } = useSideBar();
  return (
    <li className={listItemClass}>
      {!isExpanded ? (
        <Button variant="transparent" startVisual={visual} />
      ) : (
        children
      )}
    </li>
  );
};
