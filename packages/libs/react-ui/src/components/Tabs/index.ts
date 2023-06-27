import { ITabProps, Tab } from './Tab';
import { ITabContentProps, TabContent } from './TabContent';
import { ITabsContainerProps, TabsContainer } from './TabsContainer';

import { FC } from 'react';

interface ITabs extends FC<ITabsContainerProps> {
  Tab: FC<ITabProps>;
  Content: FC<ITabContentProps>;
}

export { ITabsContainerProps, ITabProps, ITabContentProps };

export const Tabs: ITabs = TabsContainer as ITabs;
Tabs.Tab = Tab;
Tabs.Content = TabContent;
