import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { listItemClass } from '../style.css';
import { Button } from './../../Button';

export interface ISideBarItem extends PropsWithChildren {
  label?: string;
  visual?: ReactElement;
  isExpanded?: boolean;
}

export const SideBarItem: FC<ISideBarItem> = ({
  label,
  isExpanded = false,
  visual,
  children,
}) => {
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
