'use client';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import type { AriaTabListProps } from 'react-aria';
import { mergeProps, useFocusRing, useTabList } from 'react-aria';
import type { Node } from 'react-stately';
import { Item as TabItem, useTabListState } from 'react-stately';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import {
  scrollContainer,
  selectorLine,
  tabListClass,
  tabsContainerClass,
} from './Tabs.css';
import { TabsPagination } from './TabsPagination';

export { TabItem };

export type ITabItemProps = React.ComponentProps<typeof TabItem>;

export interface ITabsProps
  extends Omit<AriaTabListProps<object>, 'orientation' | 'items'> {
  className?: string;
  inverse?: boolean;
  borderPosition?: 'top' | 'bottom';
  onClose?: (item: Node<object>) => void;
  isCompact?: boolean;
}

export const Tabs = ({
  className,
  borderPosition = 'bottom',
  inverse = false,
  onClose,
  isCompact,
  ...props
}: ITabsProps): ReactNode => {
  const state = useTabListState(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  const { focusProps, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    containerRef,
  );

  const getSelectedTab = () => {
    let selected = containerRef.current?.querySelector(
      '[data-selected="true"]',
    );

    if (selected === undefined || selected === null) {
      selected = containerRef.current?.querySelectorAll('div[role="tab"]')[0];
    }

    return selected as HTMLElement | undefined;
  };

  // set Selected as first tab if the tab isn't visible
  useEffect(() => {
    let selected = getSelectedTab();

    if (
      selected &&
      scrollRef.current &&
      selected.offsetLeft + selected.offsetWidth >
        (containerRef.current?.offsetWidth || 0)
    ) {
      scrollRef.current.scrollLeft = selected.offsetLeft;
    }
  }, []);

  // handle underline animation
  useLayoutEffect(() => {
    if (!containerRef.current || !selectedUnderlineRef.current) {
      return;
    }

    const selected = getSelectedTab();

    if (!selected) {
      return;
    }

    selectedUnderlineRef.current.style.setProperty(
      'transform',
      `translateX(${selected.offsetLeft}px)`,
    );

    selectedUnderlineRef.current.style.setProperty(
      'width',
      `${selected.getBoundingClientRect().width}px`,
    );
  }, [state.selectedItem?.key]);

  return (
    <div className={classNames(tabsContainerClass, className)}>
      <TabsPagination
        wrapperContainerRef={containerRef}
        scrollContainerRef={scrollRef}
      >
        <div className={scrollContainer} ref={scrollRef}>
          <div
            className={classNames(tabListClass, {
              focusVisible: isFocusVisible,
            })}
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
                onClose={onClose}
                isCompact={isCompact}
              />
            ))}
            {borderPosition === 'bottom' && (
              <span ref={selectedUnderlineRef} className={selectorLine}></span>
            )}
          </div>
        </div>
      </TabsPagination>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};
