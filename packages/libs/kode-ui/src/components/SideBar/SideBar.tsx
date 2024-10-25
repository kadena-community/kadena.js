import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBar extends PropsWithChildren {
  isExpanded?: boolean;
}

export const SideBar: FC<ISideBar> = ({ children, isExpanded = false }) => {
  return (
    <aside>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { ...child.props, isExpanded });
      })}
    </aside>
  );
};
