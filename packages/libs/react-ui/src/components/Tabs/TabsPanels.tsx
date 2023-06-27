import { TabsPanel } from './TabsPanel';

import React, { FC, ReactNode } from 'react';

export interface ITabsPanelsProps {
  children: ReactNode;
  selectedTab?: number;
}

interface ITabsPanelsComposition extends FC<ITabsPanelsProps> {
  Panel: typeof TabsPanel;
}

export const TabsPanels: ITabsPanelsComposition = ({
  // eslint-disable-next-line react/prop-types
  children,
  // eslint-disable-next-line react/prop-types
  selectedTab,
}) => {
  if (selectedTab === undefined) return null;

  return (
    <div>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === TabsPanel) {
          const props = {
            ...child.props,
            selected: selectedTab === child.props.value,
          };
          return React.cloneElement(child, props);
        }

        return null;
      })}
    </div>
  );
};

TabsPanels.Panel = TabsPanel;
