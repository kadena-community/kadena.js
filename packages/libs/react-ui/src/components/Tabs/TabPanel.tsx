import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import type { AriaTabPanelProps } from 'react-aria';
import { useTabPanel } from 'react-aria';
import type { TabListState } from 'react-stately';
import { tabContentClass } from './Tabs.css';

interface ITabPanelProps extends AriaTabPanelProps {
  state: TabListState<object>;
}

/**
 * @internal this should not be used, check the Tabs.stories
 */
export const TabPanel = ({ state, ...props }: ITabPanelProps): ReactNode => {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div className={tabContentClass} {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
};
