import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass, listItemInlineClass } from '../style.css';

export interface ISideBarItemsInline extends PropsWithChildren {
  isExpanded?: boolean;
}
export const SideBarItemsInline: FC<ISideBarItemsInline> = ({
  children,
  isExpanded = false,
}) => {
  return (
    <li className={listItemInlineClass}>
      <ul
        className={listClass({ direction: 'horizontal', expanded: isExpanded })}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { ...child.props, isExpanded });
        })}
      </ul>
    </li>
  );
};
