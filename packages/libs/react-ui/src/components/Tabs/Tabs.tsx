import classNames from 'classnames';
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
import { TabsPagination } from './TabsPagination';

export { TabItem };

export type ITabItemProps = React.ComponentProps<typeof TabItem>;

export interface ITabsProps
  extends Omit<AriaTabListProps<object>, 'orientation' | 'items'> {
  className?: string;
  inverse?: boolean;
  paginated?: boolean;
  borderPosition?: 'top' | 'bottom';
}

export const Tabs = ({
  className,
  borderPosition = 'bottom',
  inverse = false,
  paginated = false,
  ...props
}: ITabsProps): ReactNode => {
  const state = useTabListState(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { focusProps } = useFocusRing({
    within: true,
  });

  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    containerRef,
  );

  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    let selected = containerRef.current.querySelector(
      '[data-selected="true"]',
    ) as HTMLElement;
    // set Selected as first tab if the tab isn't fully visible
    if (
      selected?.offsetLeft + selected?.offsetWidth >
      containerRef.current.offsetWidth
    ) {
      scrollRef.current.scrollLeft = selected.offsetLeft;
    }
  }, []);

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

  const tablist = (
    <div className={tabListWrapperClass} ref={scrollRef}>
      <div
        className={tabListClass}
        {...mergeProps(tabListProps, focusProps)}
        ref={containerRef}
      >
        {[...state.collection].map((item) => (
          <Tab
            key={item.key}
            item={item}
            state={state}
            inverse={inverse}
            borderPosition={borderPosition}
          />
        ))}
        {borderPosition === 'bottom' && (
          <span ref={selectedUnderlineRef} className={selectorLine}></span>
        )}
      </div>
    </div>
  );

  return (
    <div className={classNames(tabsContainerClass, className)}>
      {paginated ? (
        <TabsPagination
          wrapperContainerRef={containerRef}
          scrollContainerRef={scrollRef}
        >
          {tablist}
        </TabsPagination>
      ) : (
        tablist
      )}
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};
