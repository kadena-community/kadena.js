import { MonoArrowBackIosNew, MonoArrowForwardIos } from '@kadena/react-icons';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AriaTabListProps } from 'react-aria';
import { mergeProps, useFocusRing, useTabList } from 'react-aria';
import { Item as TabItem, useTabListState } from 'react-stately';
import { Button } from '../Button';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import {
  hiddenClass,
  paginationButton,
  selectorLine,
  tabListClass,
  tabListControls,
  tabListWrapperClass,
  tabsContainerClass,
} from './Tabs.css';

export { TabItem };

export type ITabItemProps = React.ComponentProps<typeof TabItem>;

export interface ITabsProps
  extends Omit<AriaTabListProps<object>, 'orientation' | 'items'> {
  className?: string;
  inverse?: boolean;
  borderPosition?: 'top' | 'bottom';
}

export const Tabs = ({
  className,
  borderPosition = 'bottom',
  ...props
}: ITabsProps): ReactNode => {
  const state = useTabListState(props);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleButtons, setVisibleButtons] = useState({
    left: false,
    right: false,
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { focusProps, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { tabListProps } = useTabList(
    { ...props, orientation: 'horizontal' },
    state,
    containerRef,
  );

  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  // on resize determine the button visibility

  const determineButtonVisibility = () => {
    if (!scrollRef.current || !containerRef.current) return;
    const viewWidth = containerRef.current.offsetWidth;
    const maxWidth = containerRef.current.scrollWidth;
    const scrollPosition = scrollRef.current.scrollLeft;

    if (scrollPosition === 0 && visibleButtons.left) {
      setVisibleButtons((prev) => ({ ...prev, left: false }));
    }
    if (scrollPosition > 0) {
      setVisibleButtons((prev) => ({ ...prev, left: true }));
    }
    // 20 is a margin to prevent having a very small last bit to scroll
    if (viewWidth + scrollPosition >= maxWidth - 20) {
      setVisibleButtons((prev) => ({ ...prev, right: false }));
    } else {
      setVisibleButtons((prev) => ({ ...prev, right: true }));
    }
  };

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
      determineButtonVisibility();
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

  const getMinimalChildWidth = useCallback(() => {
    const children = containerRef.current?.children;

    if (!children) {
      return 0;
    }

    let minimalWidth = 0;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;

      if (child.offsetWidth > minimalWidth) {
        minimalWidth = child.offsetWidth;
      }
    }

    return minimalWidth;
  }, [containerRef]);

  const handlePagination = (direction: 'back' | 'forward') => {
    if (!containerRef.current || !scrollRef.current) return;
    const maxWidth = containerRef.current?.scrollWidth || 0;
    const viewWidth = containerRef.current?.offsetWidth || 0;
    const offset = getMinimalChildWidth();
    const currentValue = scrollRef.current.scrollLeft;

    let nextValue = 0;

    if (direction === 'forward') {
      nextValue = Math.abs(currentValue + offset);

      if (nextValue > maxWidth - viewWidth) {
        nextValue = maxWidth - viewWidth;
      }

      if (nextValue > maxWidth) {
        return;
      }

      scrollRef.current.scrollLeft = nextValue;
      determineButtonVisibility();
    } else {
      nextValue = currentValue - offset;

      if (Math.abs(currentValue) < offset) {
        nextValue = 0;
      }

      scrollRef.current.scrollLeft = nextValue;
      determineButtonVisibility();
    }
  };

  return (
    <div className={classNames(tabsContainerClass, className)}>
      <div className={tabListControls}>
        <Button
          variant="transparent"
          className={classNames(paginationButton, {
            [hiddenClass]: !visibleButtons.left,
          })}
          onPress={() => handlePagination('back')}
        >
          <MonoArrowBackIosNew />
        </Button>
        <div className={tabListWrapperClass} ref={scrollRef}>
          <div
            className={classNames(tabListClass, {
              pfocusVisible: isFocusVisible,
            })}
            {...mergeProps(tabListProps, focusProps)}
            ref={containerRef}
          >
            {[...state.collection].map((item) => (
              <Tab
                key={item.key}
                item={item}
                state={state}
                inverse={props.inverse}
                borderPosition={borderPosition}
              />
            ))}
            {borderPosition === 'bottom' && (
              <span ref={selectedUnderlineRef} className={selectorLine}></span>
            )}
          </div>
        </div>
        <Button
          variant="transparent"
          className={classNames(paginationButton, {
            [hiddenClass]: !visibleButtons.right,
          })}
          onPress={() => handlePagination('forward')}
        >
          <MonoArrowForwardIos />
        </Button>
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
};
