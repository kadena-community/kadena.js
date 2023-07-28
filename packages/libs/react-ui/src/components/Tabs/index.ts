import type { ITabProps } from './Tab';
import { Tab } from './Tab';
import type { ITabContentProps } from './TabContent';
import { TabContent } from './TabContent';
import type { ITabsContainerProps } from './TabsContainer';
import { TabsContainer } from './TabsContainer';

import { FC } from 'react';

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
