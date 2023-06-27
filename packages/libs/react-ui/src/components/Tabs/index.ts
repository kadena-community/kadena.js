import { ITabProps, Tab } from './Tab';
import { ITabsContainerProps, TabsContainer } from './TabsContainer';
import { ITabsPanelProps, TabsPanel } from './TabsPanel';

import { FC } from 'react';

interface ITabs extends FC<ITabsContainerProps> {
  Tab: FC<ITabProps>;
  Panel: FC<ITabsPanelProps>;
}

export { ITabsContainerProps, ITabProps, ITabsPanelProps };

export const Tabs: ITabs = TabsContainer as ITabs;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;
