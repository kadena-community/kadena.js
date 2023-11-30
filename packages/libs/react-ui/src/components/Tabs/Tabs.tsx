import cn from 'classnames';
import type { ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';
import type { AriaTabListProps } from 'react-aria';
import { mergeProps, useFocusRing, useTabList } from 'react-aria';
import { Item as TabItem, useTabListState } from 'react-stately';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import {
  selectorLine,
  tabListClass,
  tabListWrapperClass,
  tabsContainerClass,
} from './Tabs.css';

export { TabItem };

export type ITabItemProps = React.ComponentProps<typeof TabItem>;

export interface ITabsProps
  extends Omit<AriaTabListProps<object>, 'orientation' | 'items'> {
  className?: string;
}

export const Tabs = ({ className, ...props }: ITabsProps): ReactNode => {
  const state = useTabListState(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { focusProps, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    containerRef,
  );

  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !selectedUnderlineRef.current) {
      return;
    }

    let selected = containerRef.current.querySelector(
      '[data-selected="true"]',
    ) as HTMLElement;

    if (selected === undefined || selected === null) {
      selected = containerRef.current.querySelectorAll(
        'div[role="tab"]',
      )[0] as HTMLElement;
    }

    selectedUnderlineRef.current.style.setProperty(
      'transform',
      `translateX(${selected.offsetLeft}px)`,
    );
    selectedUnderlineRef.current.style.setProperty(
      'width',
      `${selected.offsetWidth}px`,
    );
  }, [containerRef, state.selectedItem?.key, selectedUnderlineRef]);

  return (
    <div className={cn(tabsContainerClass, className)}>
      <div className={tabListWrapperClass}>
        <div
          className={cn(tabListClass, { focusVisible: isFocusVisible })}
          {...mergeProps(tabListProps, focusProps)}
          ref={containerRef}
        >
          {[...state.collection].map((item) => (
            <Tab key={item.key} item={item} state={state} />
          ))}
          <span ref={selectedUnderlineRef} className={selectorLine}></span>
        </div>
      </div>

      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};
