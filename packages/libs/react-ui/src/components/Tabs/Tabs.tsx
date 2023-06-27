import { Tab } from './Tab';
import { selectorLine, tabsContainer } from './Tabs.css';
import { TabsPanels } from './TabsPanels';

import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface ITabsProps {
  children?: ReactNode;
  defaultSelected?: string;
}

interface ITabsComposition extends FC<ITabsProps> {
  Tab: typeof Tab;
  Panels: typeof TabsPanels;
}

// eslint-disable-next-line react/prop-types
export const Tabs: ITabsComposition = ({ children, defaultSelected = '' }) => {
  const [selectedTab, setSelectedTab] = useState<string>(defaultSelected);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;
    //find the selectedTab
    const selected = containerRef.current.querySelector(
      '[data-selected="true"]',
    ) as HTMLButtonElement;

    if (selected === undefined) return;

    lineRef.current.style.setProperty(
      'transform',
      `translateX(${selected.offsetLeft}px)`,
    );
    lineRef.current.style.setProperty('width', `${selected.offsetWidth}px`);
  }, [containerRef, selectedTab]);

  const handleClick = (value: string): void => {
    setSelectedTab(value);
  };

  return (
    <section>
      <div ref={containerRef} className={tabsContainer}>
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) return null;

          if (child.type === Tab) {
            const props = {
              ...child.props,
              selected: selectedTab === child.props.value,
              handleClick,
            };
            return React.cloneElement(child, props);
          }
          return null;
        })}

        <span ref={lineRef} className={selectorLine}></span>
      </div>

      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === TabsPanels) {
          const props = {
            selectedTab,
          };
          return React.cloneElement(child, props);
        }

        return null;
      })}
    </section>
  );
};

Tabs.Tab = Tab;
Tabs.Panels = TabsPanels;
