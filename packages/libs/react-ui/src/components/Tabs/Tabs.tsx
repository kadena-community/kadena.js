import { Tab } from './Tab';
import { TabsPanels } from './TabsPanels';

import React, { FC, ReactNode, useState } from 'react';

export interface ITabsProps {
  children?: ReactNode;
  defaultSelected?: string;
}

interface ITabsComposition extends FC<ITabsProps> {
  Tab: typeof Tab;
  Panels: typeof TabsPanels;
}

// eslint-disable-next-line react/prop-types
export const Tabs: ITabsComposition = ({ children, defaultSelected = '' }) => {
  const [selectedTab, setSelectedTab] = useState<string>(defaultSelected);

  const handleClick = (value: string): void => {
    setSelectedTab(value);
  };

  return (
    <section>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === Tab) {
          const props = {
            ...child.props,
            selected: selectedTab === child.props.value,
            handleClick,
          };
          return React.cloneElement(child, props);
        }

        if (child.type === TabsPanels) {
          const props = {
            selectedTab,
          };
          return React.cloneElement(child, props);
        }

        return null;
      })}
    </section>
  );
};

Tabs.Tab = Tab;
Tabs.Panels = TabsPanels;
