import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useSideBar } from '../SideBarProvider';
import {
  listClass,
  listItemInlineClass,
  listNotExpandedClass,
} from '../style.css';

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
