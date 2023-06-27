import { FC } from 'react';
import { Tab } from './Tab';
import { TabsPanels } from './TabsPanels';
import { TabsPanel } from './TabsPanel';

import { TabsContainer, ITabsContainerProps } from './TabsContainer';
import { ITabProps } from './Tab';
import { ITabsPanelsProps } from './TabsPanels';
import { ITabsPanelProps } from './TabsPanel';

interface ITabs extends FC<ITabsContainerProps> {
  Tab: FC<ITabProps>;
  Panels: FC<ITabsPanelsProps>;
  Panel: FC<ITabsPanelProps>;
}

export { ITabsContainerProps, ITabProps, ITabsPanelsProps, ITabsPanelProps };

export const Tabs: ITabs = TabsContainer as ITabs;
Tabs.Tab = Tab;
Tabs.Panels = TabsPanels;
Tabs.Panel = TabsPanel;
