import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBarHeader extends PropsWithChildren {
  isExpanded?: boolean;
}

export const SideBarHeader: FC<ISideBarHeader> = ({
  children,
  isExpanded = false,
}) => {
  return (
    <header>
      <ul>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { ...child.props, isExpanded });
        })}
      </ul>
    </header>
  );
};
