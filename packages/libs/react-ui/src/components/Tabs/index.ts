import { FC } from 'react';
import { Tab } from './Tab';
import { TabsPanel } from './TabsPanel';

import { TabsContainer, ITabsContainerProps } from './TabsContainer';
import { ITabProps } from './Tab';
import { ITabsPanelProps } from './TabsPanel';

interface ITabs extends FC<ITabsContainerProps> {
  Tab: FC<ITabProps>;
  Panel: FC<ITabsPanelProps>;
}

export { ITabsContainerProps, ITabProps, ITabsPanelProps };

export const Tabs: ITabs = TabsContainer as ITabs;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;
