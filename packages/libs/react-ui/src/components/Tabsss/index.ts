import type { FC } from 'react';
import type { ITabProps } from './Tab';
import { Tab } from './Tab';
import type { ITabContentProps } from './TabContent';
import { TabContent } from './TabContent';
import type { ITabsContainerProps } from './TabsContainer';
import { TabsContainer } from './TabsContainer';

interface ITabs {
  Root: FC<ITabsContainerProps>;
  Tab: FC<ITabProps>;
  Content: FC<ITabContentProps>;
}

export type { ITabContentProps, ITabProps, ITabsContainerProps };

export const Tabs: ITabs = {
  Root: TabsContainer,
  Tab: Tab,
  Content: TabContent,
};
