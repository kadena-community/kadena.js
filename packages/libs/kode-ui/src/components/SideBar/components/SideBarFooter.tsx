import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass } from '../style.css';

export interface ISideBarFooter extends PropsWithChildren {
  isExpanded?: boolean;
}

export const SideBarFooter: FC<ISideBarFooter> = ({
  children,
  isExpanded = false,
}) => {
  return (
    <footer>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { ...child.props, isExpanded });
        })}
      </ul>
    </footer>
  );
};
