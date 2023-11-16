import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import type { AriaTabListProps } from 'react-aria';
import { useTabList } from 'react-aria';
import { useTabListState } from 'react-stately';
import { tabList, tabsContainer } from './NewTabs.css';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

export { Item as TabItem } from 'react-stately';

interface ITabsProps
  extends Omit<AriaTabListProps<object>, 'orientation' | 'items'> {}

export const Tabs = (props: ITabsProps): ReactNode => {
  const state = useTabListState(props);
  const ref = useRef(null);
  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    ref,
  );
  // add disabled
  // ignore animation
  return (
    <div className={tabsContainer}>
      <div className={tabList} {...tabListProps} ref={ref}>
        {[...state.collection].map((item) => (
          <Tab key={item.key} item={item} state={state} />
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};
