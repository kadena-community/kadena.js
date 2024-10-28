import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass, menuNavWrapperClass } from '../style.css';

export interface ISideBarNavigation extends PropsWithChildren {
  isExpanded?: boolean;
}

export const SideBarNavigation: FC<ISideBarNavigation> = ({
  children,
  isExpanded = false,
}) => {
  return (
    <nav className={menuNavWrapperClass}>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { ...child.props, isExpanded });
        })}
      </ul>
    </nav>
  );
};
