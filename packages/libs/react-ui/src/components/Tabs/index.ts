import { type ITabProps, Tab } from './Tab';
import { type ITabContentProps, TabContent } from './TabContent';
import { type ITabsContainerProps, TabsContainer } from './TabsContainer';

import { type FC } from 'react';

interface ITabs {
  Root: FC<ITabsContainerProps>;
  Tab: FC<ITabProps>;
  Content: FC<ITabContentProps>;
}

export type { ITabsContainerProps, ITabProps, ITabContentProps };

export const Tabs: ITabs = {
  Root: TabsContainer,
  Tab: Tab,
  Content: TabContent,
};
