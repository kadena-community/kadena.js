import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useSideBar } from '../SideBarProvider';
import { listClass, listItemInlineClass } from '../style.css';

export interface ISideBarItemsInline extends PropsWithChildren {}
export const SideBarItemsInline: FC<ISideBarItemsInline> = ({ children }) => {
  const { isExpanded } = useSideBar();
  return (
    <li className={listItemInlineClass}>
      <ul
        className={listClass({ direction: 'horizontal', expanded: isExpanded })}
      >
        {children}
      </ul>
    </li>
  );
};
