import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBarNavigation extends PropsWithChildren {
  isExpanded?: boolean;
}

export const SideBarNavigation: FC<ISideBarNavigation> = ({
  children,
  isExpanded = false,
}) => {
  return (
    <nav>
      <ul>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { ...child.props, isExpanded });
        })}
      </ul>
    </nav>
  );
};
