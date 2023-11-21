import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import type { AriaTabProps } from 'react-aria';
import { useTab } from 'react-aria';
import type { Node, TabListState } from 'react-stately';
import { tabItemClass } from './Tabs.css';

interface ITabProps extends AriaTabProps {
  item: Node<object>;
  state: TabListState<object>;
}

/**
 * @internal this should not be used, check the Tabs.stories
 */
export const Tab = ({ item, state }: ITabProps): ReactNode => {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { tabProps } = useTab({ key }, state, ref);

  return (
    <div
      className={tabItemClass}
      {...tabProps}
      ref={ref}
      role="tab"
      data-selected={state.selectedKey === key}
    >
      {rendered}
    </div>
  );
};
