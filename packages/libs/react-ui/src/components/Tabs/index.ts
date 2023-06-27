import { ITabProps, Tab } from './Tab';
import { ITabContentProps, TabContent } from './TabContent';
import { ITabsContainerProps, TabsContainer } from './TabsContainer';

import { FC } from 'react';

interface ITabs {
  Root: FC<ITabsContainerProps>;
  Tab: FC<ITabProps>;
  Content: FC<ITabContentProps>;
}

export { ITabsContainerProps, ITabProps, ITabContentProps };

export const Tabs: ITabs = {
  Root: TabsContainer,
  Tab: Tab,
  Content: TabContent,
};
