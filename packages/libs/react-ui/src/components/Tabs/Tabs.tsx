'use client';
import classNames from 'classnames';
import type { ComponentProps, ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';
import type { AriaTabListProps } from 'react-aria';
import { mergeProps, useFocusRing, useTabList } from 'react-aria';
import type { Node as ITabNode } from 'react-stately';
import { Item as TabItem, useTabListState } from 'react-stately';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import {
  containedTabContent,
  scrollContainer,
  tabListClass,
  tabListGap,
  tabsContainerClass,
} from './Tabs.css';
import { TabsPagination } from './TabsPagination';

export { ITabNode, TabItem };

export type ITabItemProps = ComponentProps<typeof TabItem>;

export interface ITabsProps<T>
  extends Omit<AriaTabListProps<T>, 'orientation'> {
  className?: string;
  inverse?: boolean;
  borderPosition?: 'top' | 'bottom';
  onClose?: (item: ITabNode<T>) => void;
  isCompact?: boolean;
  tabPanelClassName?: string;
  isContained?: boolean;
}

export function Tabs<T extends object>({
  className,
  borderPosition = 'top',
  inverse = false,
  onClose,
  isCompact,
  tabPanelClassName,
  isContained,
  ...props
}: ITabsProps<T>): ReactNode {
  const state = useTabListState(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { focusProps, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    containerRef,
  );

  // set Selected as first tab if the tab isn't visible
  useEffect(() => {
    let selected = containerRef.current?.querySelector(
      '[data-selected="true"]',
    ) as HTMLElement | undefined;

    if (selected === undefined || selected === null) {
      selected = containerRef.current?.querySelectorAll(
        'div[role="tab"]',
      )[0] as HTMLElement;
    }

    if (
      selected &&
      scrollRef.current &&
      selected.offsetLeft + selected.offsetWidth >
        (containerRef.current?.offsetWidth || 0)
    ) {
      scrollRef.current.scrollLeft = selected.offsetLeft;
    }
  }, []);

  return (
    <div className={classNames(tabsContainerClass, className)}>
      <TabsPagination
        wrapperContainerRef={containerRef}
        scrollContainerRef={scrollRef}
      >
        <div className={scrollContainer} ref={scrollRef}>
          <div
            className={classNames(tabListClass, {
              [tabListGap]: isContained,
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
          </div>
        </div>
      </TabsPagination>
      <TabPanel
        key={state.selectedItem?.key}
        state={state}
        className={classNames(tabPanelClassName, {
          [containedTabContent]: isContained,
        })}
      />
    </div>
  );
}
