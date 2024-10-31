import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import {
  listClass,
  listItemInlineClass,
  listNotExpandedClass,
} from '../sidebar.css';
import { useSideBar } from './SideBarProvider';

export interface ISideBarItemsInline extends PropsWithChildren {}
export const SideBarItemsInline: FC<ISideBarItemsInline> = ({ children }) => {
  const { isExpanded } = useSideBar();
  return (
    <li className={listItemInlineClass}>
      <ul
        className={classNames(
          listClass({ direction: 'horizontal', expanded: isExpanded }),
          { [listNotExpandedClass]: !isExpanded },
        )}
      >
        {children}
      </ul>
    </li>
  );
};
